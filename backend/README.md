# Foracy's Blog Backend

Express.js 后端服务，用于处理博客文章上传。

## 安装依赖

```bash
cd backend
npm install
```

## 运行

**开发模式**（带热重载）：
```bash
npm run dev
```

**生产模式**：
```bash
npm start
```

服务器将在 `http://localhost:3001` 启动

## API 接口

### 1. 健康检查
```http
GET /api/health
```

**响应**：
```json
{
  "status": "ok",
  "message": "Backend server is running"
}
```

### 2. 上传文章
```http
POST /api/upload
Content-Type: application/json
```

**请求体**：
```json
{
  "post": {
    "slug": "hello-world",
    "title": "Hello World",
    "date": "2026-01-19",
    "summary": "My first blog post",
    "tags": ["算法", "React"],
    "type": "md"
  },
  "content": "# Hello World\n\nThis is my first post...",
  "fileName": "hello-world.md"
}
```

**响应**：
```json
{
  "success": true,
  "message": "文章上传成功",
  "post": { ... },
  "filePath": "/path/to/file"
}
```

**错误响应**（HTTP 400/409/500）：
```json
{
  "error": "错误信息"
}
```

### 3. 获取文章列表
```http
GET /api/posts
```

## 功能特性

✅ 支持 `.md` 和 `.html` 文件  
✅ 自动更新 meta.js  
✅ 检测重复 slug  
✅ 跨域请求支持（CORS）  
✅ 请求日志记录  
✅ 错误处理和验证  

## 开发注意事项

- 后端默认监听 **3001** 端口（可通过环境变量 `PORT` 修改）
- 前端请求 API 时确保配置正确的服务器地址
- meta.js 和文章文件自动保存到 `Foracy.com/src/posts/` 目录
- 生产环境建议添加身份认证和速率限制

## 部署

可以部署到：
- Heroku
- Railway
- Render
- AWS EC2
- 自己的服务器

例如 Heroku 部署：
```bash
git push heroku main
```
