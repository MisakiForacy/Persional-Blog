// MongoDB 初始化脚本
// 创建博客数据库用户

db = db.getSiblingDB('myblog');

db.createUser({
  user: 'bloguser',
  pwd: process.env.MONGO_USER_PASSWORD || 'blogpass123',
  roles: [
    {
      role: 'readWrite',
      db: 'myblog'
    }
  ]
});

// 创建集合和索引
db.createCollection('posts');
db.createCollection('submissions');

// 为 posts 集合创建索引
db.posts.createIndex({ slug: 1 }, { unique: true });
db.posts.createIndex({ createdAt: -1 });
db.posts.createIndex({ tags: 1 });

// 为 submissions 集合创建索引
db.submissions.createIndex({ timestamp: -1 });

print('✓ Database initialization completed');
