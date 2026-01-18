# 博客项目启动指南

## 快速开始

### 1. 安装前端依赖

```bash
cd Foracy.com
npm install
```

### 2. 安装后端依赖

```bash
cd ../backend
npm install
```

## 开发模式运行

### 方式一：分开运行（需要两个终端）

**终端1 - 启动后端服务器**：
```bash
cd backend
npm run dev
```
输出：`🚀 Blog backend server running at http://localhost:3001`

**终端2 - 启动前端开发服务器**：
```bash
cd Foracy.com
npm run dev
```
输出：`VITE v5.x.x  ready in xxx ms`，访问 `http://localhost:5173`

### 方式二：同时运行（使用并发工具）

如果有 `concurrently` 工具：
```bash
npm run dev:all  # 需要在主项目配置此脚本
```

## 配置

1. **环境变量**（前端）

在 `Foracy.com/.env` 或 `Foracy.com/.env.local` 中配置：

```
VITE_API_URL=http://localhost:3001
```

或直接使用默认值（已在 Upload.jsx 中配置）

## 测试上传功能

1. 打开浏览器访问 `http://localhost:5173/upload`
2. 填写文章信息：
   - Slug: `test-article`
   - 标题: `测试文章`
   - 概述: `这是一篇测试文章`
   - 选择标签
3. 选择本地 `.md` 或 `.html` 文件
4. 点击"确认上传"

**预期结果**：
- ✅ 文章文件保存到 `Foracy.com/src/posts/test-article.md`
- ✅ `meta.js` 自动添加新文章元数据
- ✅ 页面显示"上传成功"提示

## 项目结构

```
Persional-Blog/
├── Foracy.com/                 # 前端项目
│   ├── src/
│   │   ├── pages/Upload.jsx    # 上传页面
│   │   ├── posts/
│   │   │   ├── meta.js         # 文章元数据（自动更新）
│   │   │   └── *.md            # 文章文件（自动保存）
│   │   └── ...
│   ├── .env                    # 环境配置（可选）
│   ├── package.json
│   └── vite.config.js
│
└── backend/                    # 后端项目
    ├── server.js               # Express 服务器
    ├── package.json
    └── README.md
```

## 常见问题

**Q: 上传失败，显示"连接失败"**  
A: 确保后端服务器正在运行（终端显示 `http://localhost:3001`）

**Q: 如何在生产环境中部署？**  
A: 参考 `backend/README.md` 的部署部分

**Q: 支持哪些文件格式？**  
A: 支持 `.md`、`.markdown`、`.html`、`.htm`

**Q: Slug 重复了怎么办？**  
A: 后端会返回 409 错误，请使用不同的 Slug

---

**开发建议**：
- 两个终端同时运行前后端，便于开发和调试
- 查看浏览器控制台和服务器日志排查问题
- 生产环境建议添加身份认证
