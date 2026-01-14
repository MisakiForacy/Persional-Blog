import Link from 'next/link'

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto">
      <section className="text-center py-20">
        <h1 className="text-5xl font-bold mb-6 text-balance">
          欢迎来到我的个人博客
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
          分享技术、生活与思考
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/blog"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            查看博客
          </Link>
          <Link
            href="/about"
            className="border-2 border-blue-600 text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-800 transition"
          >
            关于我
          </Link>
        </div>
      </section>

      <section className="py-12">
        <h2 className="text-3xl font-bold mb-8">最新文章</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <article className="border rounded-lg p-6 hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-2">
              <Link href="/blog/welcome" className="hover:text-blue-600">
                欢迎来到我的博客
              </Link>
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              这是第一篇博客文章，介绍了这个博客的建立目的和内容方向...
            </p>
            <div className="text-sm text-gray-500">
              <span>2024-01-14</span>
            </div>
          </article>

          <article className="border rounded-lg p-6 hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-2">
              <Link href="/blog/getting-started" className="hover:text-blue-600">
                开始使用 Next.js
              </Link>
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              了解如何使用 Next.js 搭建现代化的 Web 应用...
            </p>
            <div className="text-sm text-gray-500">
              <span>2024-01-13</span>
            </div>
          </article>
        </div>
      </section>
    </div>
  )
}
