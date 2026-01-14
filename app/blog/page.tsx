import Link from 'next/link'

interface BlogPost {
  slug: string
  title: string
  excerpt: string
  date: string
  tags: string[]
}

const blogPosts: BlogPost[] = [
  {
    slug: 'welcome',
    title: '欢迎来到我的博客',
    excerpt: '这是第一篇博客文章，介绍了这个博客的建立目的和内容方向。我会在这里分享技术学习心得、项目经验以及生活感悟。',
    date: '2024-01-14',
    tags: ['公告', '介绍'],
  },
  {
    slug: 'getting-started',
    title: '开始使用 Next.js',
    excerpt: 'Next.js 是一个强大的 React 框架，让我们可以快速构建现代化的 Web 应用。本文介绍如何开始使用 Next.js。',
    date: '2024-01-13',
    tags: ['Next.js', 'React', '前端'],
  },
]

export default function BlogPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-8">博客文章</h1>
      
      <div className="space-y-8">
        {blogPosts.map((post) => (
          <article
            key={post.slug}
            className="border rounded-lg p-6 hover:shadow-lg transition"
          >
            <h2 className="text-2xl font-semibold mb-3">
              <Link
                href={`/blog/${post.slug}`}
                className="hover:text-blue-600"
              >
                {post.title}
              </Link>
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {post.excerpt}
            </p>
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <time className="text-sm text-gray-500">{post.date}</time>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
