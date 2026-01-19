// src/pages/AboutMe.jsx
export default function About() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-6 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg shadow-md">
      <header className="text-center">
        <h1 className="text-3xl font-bold">关于我</h1>
        <div className="w-16 h-1 bg-gray-200 dark:bg-gray-700 mx-auto mt-4 rounded-full"></div>
      </header>

      <section className="prose prose-indigo prose-lg max-w-none leading-relaxed text-gray-900 dark:text-gray-100 space-y-4">
        <p>
          你好，我是 <strong>Foracy</strong>，一名热爱技术与思考的开发者。
        </p>

        <p>这个博客是我的个人空间，记录我在编程、技术和生活中的点滴感悟。</p>

        <p>
          <strong>我相信的: </strong>
          <br />
          <i>越简单越美</i>
        </p>

        <p>
          <strong>我擅长的: </strong>
          <br />
          <i>算法与数据结构、前端开发、全栈开发</i>
        </p>

        <p>
          <strong>我热爱的: </strong>
          <br />
          <i>长跑、足球</i>
        </p>

        <p>
          <strong>在探索的：</strong>
          <br />
          <span className="flex flex-wrap gap-2">
            {['React', 'TypeScript', 'Tailwind CSS', 'Vite', 'Unity'].map(
              (tech) => (
                <span
                  key={tech}
                  className="bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded text-sm"
                >
                  {tech}
                </span>
              )
            )}
          </span>
        </p>

        <div>
          <strong>如果你想联系我：</strong>
          <div className="mt-3 space-y-2">
            <div className="flex items-start gap-2">
              <span className="font-medium">📧 Email:</span>
              <div className="flex flex-wrap items-center gap-1">
                <a
                  href="mailto:fuxuanyu243@gmail.com"
                  className="text-blue-600 hover:underline dark:text-blue-400"
                >
                  fuxuanyu243@gmail.com
                </a>
                <span>or</span>
                <a
                  href="mailto:3208724733@qq.com"
                  className="text-blue-600 hover:underline dark:text-blue-400"
                >
                  3208724733@qq.com
                </a>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">📱 微信:</span>
              <span className="dark:text-gray-100">foracy34</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">📱 QQ:</span>
              <span className="dark:text-gray-100">3208724733</span>
            </div>
          </div>
        </div>

        <blockquote className="border-l-4 border-gray-300 pl-4 italic text-gray-600 dark:border-gray-500 dark:text-gray-400">
          “写作不是为了被看见，而是为了不被自己遗忘。”
        </blockquote>
      </section>
    </div>
  );
}
