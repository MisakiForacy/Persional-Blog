import Link from 'next/link'

export default function WelcomePost() {
  return (
    <article className="max-w-3xl mx-auto">
      <div className="mb-8">
        <Link href="/blog" className="text-blue-600 hover:underline">
          ← 返回博客列表
        </Link>
      </div>

      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-4">欢迎来到我的博客</h1>
        <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400">
          <time>2024-01-14</time>
          <div className="flex gap-2">
            <span className="bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded-full text-sm">
              公告
            </span>
            <span className="bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded-full text-sm">
              介绍
            </span>
          </div>
        </div>
      </header>

      <div className="prose dark:prose-invert max-w-none">
        <h2>你好！</h2>
        <p>
          欢迎来到我的个人博客！这是我搭建的第一个博客网站，我会在这里分享我的技术学习心得、项目经验以及生活感悟。
        </p>

        <h2>博客的目的</h2>
        <p>
          建立这个博客的主要目的有以下几点：
        </p>
        <ul>
          <li><strong>记录学习</strong>：记录学习过程中的知识点和遇到的问题</li>
          <li><strong>分享经验</strong>：分享项目开发中的经验和最佳实践</li>
          <li><strong>技术交流</strong>：与其他开发者交流技术心得</li>
          <li><strong>个人成长</strong>：通过写作提升思考和表达能力</li>
        </ul>

        <h2>内容方向</h2>
        <p>
          博客内容主要包括：
        </p>
        <ul>
          <li>前端开发技术（React、Next.js、TypeScript 等）</li>
          <li>后端开发经验</li>
          <li>项目实战分享</li>
          <li>工具和效率提升</li>
          <li>技术思考和感悟</li>
        </ul>

        <h2>技术栈</h2>
        <p>
          本博客使用以下技术栈构建：
        </p>
        <ul>
          <li><strong>框架</strong>：Next.js 16</li>
          <li><strong>语言</strong>：TypeScript</li>
          <li><strong>样式</strong>：Tailwind CSS</li>
          <li><strong>部署</strong>：可部署到 Vercel、GitHub Pages 等平台</li>
        </ul>

        <h2>结语</h2>
        <p>
          感谢你访问我的博客！如果你对我的内容感兴趣，欢迎经常来访。如果有任何问题或建议，也欢迎通过 GitHub 或邮件联系我。
        </p>
        <p>
          让我们一起学习，一起成长！
        </p>
      </div>
    </article>
  )
}
