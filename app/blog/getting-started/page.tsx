import Link from 'next/link'

export default function GettingStartedPost() {
  return (
    <article className="max-w-3xl mx-auto">
      <div className="mb-8">
        <Link href="/blog" className="text-blue-600 hover:underline">
          ← 返回博客列表
        </Link>
      </div>

      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-4">开始使用 Next.js</h1>
        <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400">
          <time>2024-01-13</time>
          <div className="flex gap-2">
            <span className="bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded-full text-sm">
              Next.js
            </span>
            <span className="bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded-full text-sm">
              React
            </span>
            <span className="bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded-full text-sm">
              前端
            </span>
          </div>
        </div>
      </header>

      <div className="prose dark:prose-invert max-w-none">
        <h2>什么是 Next.js？</h2>
        <p>
          Next.js 是一个基于 React 的强大框架，它提供了许多开箱即用的功能，让我们可以快速构建现代化的 Web 应用。
        </p>

        <h2>主要特性</h2>
        <ul>
          <li><strong>服务端渲染（SSR）</strong>：提升首屏加载速度和 SEO</li>
          <li><strong>静态站点生成（SSG）</strong>：预渲染页面，性能极佳</li>
          <li><strong>API 路由</strong>：轻松构建 API 端点</li>
          <li><strong>文件系统路由</strong>：基于文件结构的直观路由</li>
          <li><strong>图片优化</strong>：自动优化图片加载</li>
          <li><strong>TypeScript 支持</strong>：开箱即用的 TypeScript 支持</li>
        </ul>

        <h2>快速开始</h2>
        <p>
          创建一个新的 Next.js 项目非常简单：
        </p>
        <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto">
          <code>npx create-next-app@latest my-blog</code>
        </pre>

        <h2>项目结构</h2>
        <p>
          Next.js 使用 App Router，主要目录结构如下：
        </p>
        <ul>
          <li><code>app/</code>：应用页面和路由</li>
          <li><code>components/</code>：可复用组件</li>
          <li><code>public/</code>：静态资源</li>
          <li><code>next.config.js</code>：Next.js 配置文件</li>
        </ul>

        <h2>开发命令</h2>
        <p>
          常用的开发命令：
        </p>
        <ul>
          <li><code>npm run dev</code>：启动开发服务器</li>
          <li><code>npm run build</code>：构建生产版本</li>
          <li><code>npm run start</code>：运行生产服务器</li>
        </ul>

        <h2>总结</h2>
        <p>
          Next.js 是一个功能强大、易于使用的 React 框架，非常适合用来搭建个人博客、企业网站等各类 Web 应用。
          如果你想学习 Next.js，建议从官方文档开始，并通过实践项目来加深理解。
        </p>
      </div>
    </article>
  )
}
