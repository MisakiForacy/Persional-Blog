import { MongoClient } from 'mongodb';
import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const MONGODB_DB = process.env.MONGODB_DB || 'myblog';

async function migratePostsToMongo() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    console.log('连接到 MongoDB...');
    await client.connect();
    const db = client.db(MONGODB_DB);
    const postsCollection = db.collection('posts');
    
    // 读取 meta.js
    const metaPath = join(__dirname, '../Foracy.com/src/posts/meta.js');
    const postsDir = join(__dirname, '../Foracy.com/src/posts');
    
    if (!existsSync(metaPath)) {
      console.error('meta.js 不存在');
      return;
    }
    
    const metaContent = readFileSync(metaPath, 'utf-8');
    const postsArrayMatch = metaContent.match(/export const posts = \[([\s\S]*)\];/);
    
    if (!postsArrayMatch) {
      console.error('无法解析 meta.js');
      return;
    }
    
    const postsArrayCode = `[${postsArrayMatch[1]}]`;
    const postsList = Function(`return ${postsArrayCode}`)();
    
    console.log(`找到 ${postsList.length} 篇文章`);
    
    let imported = 0;
    let skipped = 0;
    
    for (const post of postsList) {
      try {
        // 检查是否已存在
        const existed = await postsCollection.findOne({ slug: post.slug });
        if (existed) {
          console.log(`跳过已存在: ${post.slug}`);
          skipped++;
          continue;
        }
        
        // 读取文章内容
        const ext = post.type === 'html' ? 'html' : 'md';
        const contentPath = join(postsDir, `${post.slug}.${ext}`);
        
        let content = '';
        if (existsSync(contentPath)) {
          content = readFileSync(contentPath, 'utf-8');
        } else {
          console.warn(`文件不存在: ${contentPath}`);
        }
        
        // 插入到 MongoDB
        await postsCollection.insertOne({
          slug: post.slug,
          title: post.title,
          date: post.date,
          summary: post.summary || '',
          tags: post.tags || [],
          type: post.type || 'md',
          content: content,
          createdAt: new Date(post.date || Date.now()),
          updatedAt: new Date(post.date || Date.now()),
        });
        
        console.log(`✓ 导入成功: ${post.title} (${post.slug})`);
        imported++;
      } catch (err) {
        console.error(`导入失败 ${post.slug}:`, err.message);
      }
    }
    
    console.log('\n迁移完成！');
    console.log(`成功导入: ${imported} 篇`);
    console.log(`跳过: ${skipped} 篇`);
    
  } catch (error) {
    console.error('迁移失败:', error);
  } finally {
    await client.close();
  }
}

migratePostsToMongo();
