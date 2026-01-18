// src/pages/About.jsx
export default function About() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12 space-y-8">
      <header className="text-center">
        <h1 className="text-3xl font-bold">关于我</h1>
        <div className="w-16 h-1 bg-blue-500 dark:bg-blue-400 mx-auto mt-4 rounded-full"></div>
      </header>

      <section className="prose prose-gray dark:prose-invert max-w-none leading-relaxed flex flex-col space-y-6">
        <p>
            你好，我是 <strong>Foracy</strong>，一名热爱技术与思考的开发者。
        </p>
        <p>
            这个博客是我的个人空间，记录我在编程、技术和生活中的点滴感悟。
        </p>
        <p>
            <b>我相信的：</b><br />
            • 代码是逻辑的艺术<br />
            • 写作是思考的延伸<br />
            • 持续输出是最好的输入
        </p>
        <p>
            <b>我擅长的：</b><br />
            算法与数据结构➡️
            <a href="https://codeforces.com/profile/FXY_AC" className="">
                codeforces个人主页
            </a><br />

        </p>
        <p>
            <b>在探索的：</b><br />
            <span className="inline-block mt-1">
                <span className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm mr-2">React</span>
                <span className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm mr-2">TypeScript</span>
                <span className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm mr-2">Tailwind CSS</span>
                <span className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm mr-2">Vite</span>
                <span className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm">Unity</span>
            </span>
        </p>

        <p>
            如果你想联系我：<br />
            <div className="flex space-x-2">
                <b>Email📧:</b>
                <a 
                    href="mailto:fuxuanyu243@gmail.com" 
                    className="text-blue-600 hover:underline dark:text-blue-400"
                    >
                    fuxuanyu243@gmail.com
                </a>
                <p>or</p>
                <a 
                    href="mailto:3208724733@qq.com"
                    className="text-blue-600 hover:underline dark:text-blue-400"
                    >
                    3208724733@qq.com
                </a>
            </div>
            <div>
                <b>微信📱:</b>
                <span className="ml-2">foracy34</span>
            </div>
            <div>
                <b>qq📱:</b>
                <span className="ml-2">3208724733</span>
            </div>
        </p>

        <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-700 dark:text-gray-300">
          “写作不是为了被看见，而是为了不被自己遗忘。”
        </blockquote>
      </section>
    </div>
  );
}