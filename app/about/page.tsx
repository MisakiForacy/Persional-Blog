export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-4xl font-bold mb-8">关于我</h1>
      
      <div className="prose dark:prose-invert max-w-none">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">个人简介</h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            你好！欢迎来到我的个人博客。我是一名热爱技术的开发者，喜欢探索新技术、分享学习心得。
          </p>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            这个博客主要用来记录我的技术学习过程、项目经验以及生活感悟。希望通过分享，能够帮助到更多的人。
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">技术栈</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
            <li>前端：React, Next.js, TypeScript, Tailwind CSS</li>
            <li>后端：Node.js, Python</li>
            <li>数据库：MySQL, MongoDB</li>
            <li>工具：Git, Docker</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">联系方式</h2>
          <div className="space-y-2 text-gray-700 dark:text-gray-300">
            <p>如果你想和我交流，可以通过以下方式联系我：</p>
            <ul className="list-disc list-inside space-y-1">
              <li>GitHub: <a href="https://github.com/MisakiForacy" className="text-blue-600 hover:underline">@MisakiForacy</a></li>
              <li>Email: your-email@example.com</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">关于本站</h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            本博客使用 Next.js + TypeScript + Tailwind CSS 构建，采用静态站点生成方式，可部署在 GitHub Pages、Vercel 等平台。
          </p>
        </section>
      </div>
    </div>
  )
}
