# 个人博客 - Personal Blog

这是一个使用 Next.js + TypeScript + Tailwind CSS 构建的个人博客网站。

## 技术栈

- **框架**: Next.js 16
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **部署**: 静态导出，可部署到 GitHub Pages、Vercel 等平台

## 功能特性

- ✅ 响应式设计，支持移动端和桌面端
- ✅ 深色模式支持
- ✅ 博客文章列表和详情页
- ✅ 关于页面
- ✅ 简洁美观的 UI 设计
- ✅ 静态站点生成，加载速度快

## 快速开始

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

打开浏览器访问 [http://localhost:3000](http://localhost:3000)

### 构建生产版本

```bash
npm run build
```

构建完成后，静态文件将输出到 `out` 目录。

### 运行生产版本

```bash
npm start
```

## 项目结构

```
├── app/                    # Next.js App Router 页面
│   ├── layout.tsx         # 全局布局
│   ├── page.tsx           # 首页
│   ├── globals.css        # 全局样式
│   ├── blog/              # 博客页面
│   │   ├── page.tsx       # 博客列表
│   │   ├── welcome/       # 示例文章
│   │   └── getting-started/
│   └── about/             # 关于页面
├── components/            # 可复用组件
│   ├── Header.tsx        # 导航栏
│   └── Footer.tsx        # 页脚
├── public/               # 静态资源
├── next.config.js        # Next.js 配置
├── tailwind.config.js    # Tailwind CSS 配置
└── tsconfig.json         # TypeScript 配置
```

## 自定义内容

### 修改博客信息

1. 编辑 `app/layout.tsx` 修改网站标题和描述
2. 编辑 `components/Header.tsx` 修改导航栏标题
3. 编辑 `components/Footer.tsx` 修改页脚信息

### 添加新文章

1. 在 `app/blog` 目录下创建新文件夹，如 `my-new-post`
2. 创建 `page.tsx` 文件，参考现有文章格式
3. 在 `app/blog/page.tsx` 中添加文章信息到 `blogPosts` 数组

### 修改样式

- 编辑 `app/globals.css` 修改全局样式
- 编辑 `tailwind.config.js` 自定义 Tailwind 配置

## 部署

### GitHub Pages

1. 在 GitHub 仓库设置中启用 GitHub Pages
2. 设置源为 `gh-pages` 分支
3. 推送代码后，GitHub Actions 会自动构建和部署

### Vercel

1. 导入 GitHub 仓库到 Vercel
2. Vercel 会自动检测 Next.js 项目并进行配置
3. 部署完成后即可访问

## License

MIT