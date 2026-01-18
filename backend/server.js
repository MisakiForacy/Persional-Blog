import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// 中间件配置
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// 记录请求
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend server is running' });
});

// 上传文章接口
app.post('/api/upload', (req, res) => {
  try {
    const { post, content, fileName } = req.body;

    // 验证必填字段
    if (!post || !post.slug || !post.title) {
      return res.status(400).json({ 
        error: '缺少必填字段：slug 或 title' 
      });
    }

    if (!content) {
      return res.status(400).json({ 
        error: '缺少文件内容' 
      });
    }

    if (!fileName) {
      return res.status(400).json({ 
        error: '缺少文件名' 
      });
    }

    // 构建文件路径（指向前端项目）
    const postsDir = join(__dirname, '../Foracy.com/src/posts');
    const filePath = join(postsDir, fileName);

    // 确保目录存在
    if (!existsSync(postsDir)) {
      mkdirSync(postsDir, { recursive: true });
    }

    // 保存文件
    writeFileSync(filePath, content, 'utf-8');
    console.log(`✓ 文件已保存: ${filePath}`);

    // 更新 meta.js
    const metaPath = join(postsDir, 'meta.js');
    
    // 读取现有 meta.js
    let metaContent = readFileSync(metaPath, 'utf-8');

    // 构建新文章对象
    const newPost = {
      slug: post.slug,
      title: post.title,
      date: post.date,
      summary: post.summary || '',
      ...(post.tags && post.tags.length > 0 && { tags: post.tags }),
      type: post.type || 'md'
    };

    // 转换为JavaScript代码
    const postCode = JSON.stringify(newPost, null, 4);

    // 找到 posts 数组并插入新文章
    // 将最后一个 } 之前的内容找到，在里面添加新文章
    const postsArrayMatch = metaContent.match(/export const posts = \[([\s\S]*)\];/);
    
    if (postsArrayMatch) {
      const postsArray = postsArrayMatch[1];
      
      // 检查是否已存在相同 slug 的文章
      const slugRegex = new RegExp(`slug:\\s*["']${post.slug}["']`, 'i');
      if (slugRegex.test(postsArray)) {
        return res.status(409).json({ 
          error: `Slug "${post.slug}" 已存在，请使用不同的 Slug` 
        });
      }

      // 在数组中插入新文章
      const updatedArray = postsArray.trim();
      let newContent;
      
      if (updatedArray === '') {
        // 空数组
        newContent = metaContent.replace(
          /export const posts = \[\];/,
          `export const posts = [\n    ${postCode}\n];`
        );
      } else {
        // 非空数组，在最后添加
        newContent = metaContent.replace(
          /export const posts = \[([\s\S]*)\];/,
          `export const posts = [${updatedArray},\n    ${postCode}\n];`
        );
      }

      // 保存更新后的 meta.js
      writeFileSync(metaPath, newContent, 'utf-8');
      console.log(`✓ meta.js 已更新`);
    } else {
      throw new Error('meta.js 格式不正确');
    }

    // 返回成功响应
    res.json({ 
      success: true,
      message: '文章上传成功',
      post: newPost,
      filePath: filePath
    });

  } catch (error) {
    console.error('错误:', error.message);
    res.status(500).json({ 
      error: error.message || '服务器错误' 
    });
  }
});

// 获取所有文章列表
app.get('/api/posts', (req, res) => {
  try {
    const metaPath = join(__dirname, '../Foracy.com/src/posts/meta.js');
    
    if (!existsSync(metaPath)) {
      return res.json({ posts: [] });
    }

    const metaContent = readFileSync(metaPath, 'utf-8');
    
    // 这是一个简单的提取，生产环境应该更安全
    const postsArrayMatch = metaContent.match(/export const posts = \[([\s\S]*)\];/);
    
    if (postsArrayMatch) {
      // 返回原始内容，让前端自己解析
      res.json({ 
        success: true,
        raw: metaContent 
      });
    } else {
      res.json({ posts: [] });
    }
  } catch (error) {
    console.error('错误:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// 404 处理
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Not Found',
    path: req.path
  });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`\n🚀 Blog backend server running at http://localhost:${PORT}`);
  console.log(`\n可用的 API 端点:`);
  console.log(`  GET  /api/health       - 健康检查`);
  console.log(`  POST /api/upload       - 上传文章`);
  console.log(`  GET  /api/posts        - 获取文章列表\n`);
});

// 优雅关闭
process.on('SIGTERM', () => {
  console.log('\n服务器关闭中...');
  process.exit(0);
});
