import Link from 'next/link'

export default function Header() {
  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            我的博客
          </Link>
          
          <div className="flex gap-6">
            <Link
              href="/"
              className="hover:text-blue-600 transition"
            >
              首页
            </Link>
            <Link
              href="/blog"
              className="hover:text-blue-600 transition"
            >
              博客
            </Link>
            <Link
              href="/about"
              className="hover:text-blue-600 transition"
            >
              关于
            </Link>
          </div>
        </div>
      </nav>
    </header>
  )
}
