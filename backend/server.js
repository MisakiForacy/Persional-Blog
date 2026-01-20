import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { create, all } from 'mathjs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync, writeFileSync, existsSync, mkdirSync, unlinkSync } from 'fs';
import { MongoClient, ObjectId } from 'mongodb';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ADMIN_PAGE_DIR = join(__dirname, 'admin-page');

const app = express();
const PORT = process.env.PORT || 3001;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const MONGODB_DB = process.env.MONGODB_DB || 'myblog';

// MongoDB 连接
const mongoClient = new MongoClient(MONGODB_URI, {
  serverSelectionTimeoutMS: 5000,
});
const dbPromise = mongoClient.connect().then((client) => client.db(MONGODB_DB));
const getDb = async () => dbPromise;

// math.js 实例（后端数学库）
const math = create(all);

// 中间件配置
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// 后台上传页面静态资源
app.use('/admin', express.static(ADMIN_PAGE_DIR));

// 记录请求
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// 认证中间件：验证密钥
const verifyAuth = (req, res, next) => {
  const secretKey = process.env.ADMIN_SECRET_KEY || 'fxy091582'; // 默认密钥（可改为环境变量）
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';

  if (token === secretKey) {
    next();
  } else {
    res.status(401).json({ success: false, error: '未授权：密钥不正确或未提供' });
  }
};

// 生成唯一的随机8位ID（00000000-99999999），避免与已有重复
const getRandomId = (metaPath) => {
  try {
    const used = new Set();
    if (existsSync(metaPath)) {
      const metaContent = readFileSync(metaPath, 'utf-8');
      const match = metaContent.match(/export const posts = \[([\s\S]*?)\];/);
      if (match && match[1].trim()) {
        const postsList = Function(`return [${match[1]}]`)();
        postsList.forEach((post) => {
          if (post.slug && /^\d{8}$/.test(post.slug)) {
            used.add(post.slug);
          }
        });
      }
    }

    // 尝试生成不重复的随机ID
    for (let i = 0; i < 1000; i++) {
      const n = Math.floor(Math.random() * 100000000); // 0..99,999,999
      const id = String(n).padStart(8, '0');
      if (!used.has(id)) return id;
    }

    // 兜底：使用当前时间片生成
    const fallback = String(Date.now() % 100000000).padStart(8, '0');
    if (!used.has(fallback)) return fallback;

    // 最后兜底：线性探测
    let n2 = Math.floor(Math.random() * 100000000);
    for (let i = 0; i < 100000000; i++) {
      const id2 = String(n2).padStart(8, '0');
      if (!used.has(id2)) return id2;
      n2 = (n2 + 1) % 100000000;
    }
    return '00000000';
  } catch (error) {
    console.error('生成随机ID错误:', error);
    return String(Math.floor(Math.random() * 100000000)).padStart(8, '0');
  }
};

// 提交历史记录管理（仅写入 MongoDB）
const recordBlogSubmission = async (operationType) => {
  try {
    // 记录当前操作
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;
    
    const entry = {
      date: dateStr,
      timestamp: now.toISOString(),
      type: operationType,
      createdAt: now
    };

    // 保存到 MongoDB
    const db = await getDb();
    const result = await db.collection('submissions').insertOne(entry);
    console.log(`✓ 提交记录已记录到数据库: ${dateStr} (${operationType})`);
  } catch (error) {
    console.error('记录提交失败:', error.message);
  }
};

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend server is running' });
});

// 数学表达式评估（示例：/api/math/evaluate?expr=2+3*4）
app.get('/api/math/evaluate', (req, res) => {
  try {
    const { expr } = req.query;
    if (!expr || typeof expr !== 'string' || !expr.trim()) {
      return res.status(400).json({ error: '缺少表达式参数 expr' });
    }
    const result = math.evaluate(expr);
    res.json({ success: true, expr, result });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 获取墨客提交历史记录
app.get('/api/blog-submissions', (req, res) => {
  try {
    const submissionsPath = join(__dirname, '../Foracy.com/src/posts', 'submissions.json');
    
    let submissions = [];
    if (existsSync(submissionsPath)) {
      try {
        const content = readFileSync(submissionsPath, 'utf-8');
        submissions = JSON.parse(content);
      } catch (err) {
        console.warn('读取提交记录失败:', err.message);
      }
    }
    
    // 汇总每日的提交次数
    const submissionMap = {};
    submissions.forEach((submission) => {
      const dateStr = submission.date;
      if (dateStr) {
        submissionMap[dateStr] = (submissionMap[dateStr] || 0) + 1;
      }
    });
    
    res.json({ 
      success: true,
      submissions: submissionMap,
      total: submissions.length
    });
  } catch (error) {
    console.error('获取提交记录失败:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// 获取下一个可用ID
app.get('/api/next-id', (req, res) => {
  try {
    const metaPath = join(__dirname, '../Foracy.com/src/posts/meta.js');
    const nextId = getRandomId(metaPath);
    res.json({ success: true, nextId });
  } catch (error) {
    console.error('获取ID错误:', error);
    res.status(500).json({ error: error.message });
  }
});

// 上传文章接口（需要认证）
app.post('/api/upload', verifyAuth, async (req, res) => {
  try {
    const { post, content } = req.body;

    // 验证必填字段
    if (!post || !post.title) {
      return res.status(400).json({ 
        error: '缺少必填字段：title' 
      });
    }

    if (!content) {
      return res.status(400).json({ 
        error: '缺少文件内容' 
      });
    }

    // 生成随机 slug
    const metaPath = join(__dirname, '../Foracy.com/src/posts/meta.js');
    if (!post.slug) {
      post.slug = getRandomId(metaPath);
    }

    // 构建新文章对象
    const newPost = {
      slug: post.slug,
      title: post.title,
      date: post.date,
      summary: post.summary || '',
      ...(post.tags && post.tags.length > 0 && { tags: post.tags }),
      type: post.type || 'md'
    };

    // 直接写入 MongoDB（无需文件系统操作）
    const db = await getDb();
    
    // 检查是否已存在相同 slug
    const existed = await db.collection('posts').findOne({ slug: post.slug });
    if (existed) {
      return res.status(409).json({
        error: `Slug "${post.slug}" 已存在，请使用不同的 Slug`
      });
    }

    // 插入新文章到数据库
    const result = await db.collection('posts').insertOne({
      ...newPost,
      content,
      createdAt: new Date(),
    });
    console.log(`✓ 文章已保存到数据库: ${newPost.slug}`);

    // 记录提交历史
    await recordBlogSubmission('upload');

    // 返回成功响应
    res.json({ 
      success: true,
      message: '文章上传成功',
      post: newPost,
      insertedId: result.insertedId
    });

  } catch (error) {
    console.error('错误:', error.message);
    res.status(500).json({ 
      error: error.message || '服务器错误' 
    });
  }
});

// 更新文章接口（需要认证）
app.post('/api/update', verifyAuth, async (req, res) => {
  try {
    const { post, content } = req.body;

    // 验证必填字段
    if (!post || !post.slug) {
      return res.status(400).json({ 
        error: '缺少必填字段：slug' 
      });
    }

    if (!post.title) {
      return res.status(400).json({ 
        error: '缺少必填字段：title' 
      });
    }

    if (!content) {
      return res.status(400).json({ 
        error: '缺少文件内容' 
      });
    }

    // 生成当前更新时间
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const updateDate = `${year}-${month}-${day} ${hours}:${minutes}`;

    // 构建更新的文章对象
    const updatedPost = {
      slug: post.slug,
      title: post.title,
      date: updateDate, // 更新为当前时间
      summary: post.summary || '',
      ...(post.tags && post.tags.length > 0 && { tags: post.tags }),
      type: post.type || 'md'
    };

    // 直接更新 MongoDB（无需文件系统操作）
    const db = await getDb();
    
    // 检查文章是否存在
    const existed = await db.collection('posts').findOne({ slug: post.slug });
    if (!existed) {
      return res.status(404).json({ 
        error: `未找到 slug 为 "${post.slug}" 的文章` 
      });
    }

    // 更新文章
    await db.collection('posts').updateOne(
      { slug: post.slug },
      {
        $set: {
          ...updatedPost,
          content,
          updatedAt: new Date(),
        },
      }
    );
    console.log(`✓ 文章已更新: ${post.slug}`);

    // 记录提交历史
    await recordBlogSubmission('update');

    // 返回成功响应
    res.json({ 
      success: true,
      message: '文章更新成功',
      post: updatedPost
    });

  } catch (error) {
    console.error('更新错误:', error.message);
    res.status(500).json({ 
      error: error.message || '服务器错误' 
    });
  }
});

// 删除文章接口（需要认证）
app.delete('/api/posts/:slug', verifyAuth, async (req, res) => {
  try {
    const { slug } = req.params;
    if (!slug) {
      return res.status(400).json({ error: '缺少 slug' });
    }

    // 直接从 MongoDB 删除（无需文件系统操作）
    const db = await getDb();
    
    // 查找要删除的文章
    const post = await db.collection('posts').findOne({ slug });
    if (!post) {
      return res.status(404).json({ error: `未找到 slug 为 "${slug}" 的文章` });
    }

    // 删除文章
    const result = await db.collection('posts').deleteOne({ slug });
    console.log(`✓ 文章已从数据库删除: ${slug}`);

    // 记录提交历史
    await recordBlogSubmission('delete');

    return res.json({ success: true, deleted: post });
  } catch (error) {
    console.error('删除错误:', error.message);
    return res.status(500).json({ error: error.message || '服务器错误' });
  }
});

// 获取所有文章列表
app.get('/api/posts', async (req, res) => {
  try {
    // 从 MongoDB 读取文章（包含完整内容）
    const db = await getDb();
    const postsList = await db.collection('posts').find({}).toArray();
    
    // 如果数据库为空，则回退到 meta.js（向后兼容）
    if (postsList.length === 0) {
      const metaPath = join(__dirname, '../Foracy.com/src/posts/meta.js');
      
      if (!existsSync(metaPath)) {
        return res.json({ success: true, posts: [] });
      }

      const metaContent = readFileSync(metaPath, 'utf-8');
      
      // 解析 posts 数组
      const postsArrayMatch = metaContent.match(/export const posts = \[([\s\S]*)\];/);
      
      if (postsArrayMatch) {
        try {
          // 安全地解析 posts 数组
          const postsArrayCode = `[${postsArrayMatch[1]}]`;
          const metaOnlyPostsList = Function(`return ${postsArrayCode}`)();
          
          return res.json({ 
            success: true,
            posts: metaOnlyPostsList
          });
        } catch (parseError) {
          console.error('解析 posts 失败:', parseError);
          return res.json({ success: true, posts: [] });
        }
      } else {
        return res.json({ success: true, posts: [] });
      }
    }

    // 从 MongoDB 返回完整文章数据（包含 content）
    res.json({ 
      success: true,
      posts: postsList
    });
  } catch (error) {
    console.error('错误:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// LeetCode API 代理
app.post('/api/leetcode', async (req, res) => {
  try {
    const { query, variables } = req.body;
    
    const response = await fetch('https://leetcode.cn/graphql/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ query, variables })
    });
    
    if (response.ok) {
      const data = await response.json();
      res.json(data);
    } else {
      res.status(response.status).json({ 
        error: `LeetCode API returned ${response.status}`
      });
    }
  } catch (err) {
    console.error('LeetCode proxy error:', err);
    res.status(500).json({ error: err.message });
  }
});

// 后台上传页面入口
app.get('/admin', (req, res) => {
  res.sendFile(join(ADMIN_PAGE_DIR, 'index.html'));
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
  console.log(`  GET  /api/health            - 健康检查`);
  console.log(`  GET  /api/math/evaluate     - 计算表达式 (?expr=2+3*4)`);
  console.log(`  GET  /api/next-id           - 获取随机8位ID`);
  console.log(`  POST /api/upload            - 上传文章`);
  console.log(`  POST /api/update            - 更新文章`);
  console.log(`  GET  /api/blog-submissions  - 获取博客提交历史记录`);
  console.log(`  GET  /api/posts             - 获取文章列表`);
  console.log(`  DELETE /api/posts/:slug     - 删除文章\n`);
});

// 优雅关闭
process.on('SIGTERM', () => {
  console.log('\n服务器关闭中...');
  process.exit(0);
});
