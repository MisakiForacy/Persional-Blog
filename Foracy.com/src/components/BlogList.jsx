import { posts } from '../posts/meta';

export default function BlogList() {
  // 过滤掉无效的文章（确保有 slug 属性）
  const validPosts = posts.filter((post) => post && post.slug);

  // 按日期降序排序，最近的文章在前
  const sortedPosts = [...validPosts].sort((a, b) => {
    const aDate = new Date(a.date || a.data || 0);
    const bDate = new Date(b.date || b.data || 0);
    return bDate - aDate;
  });

  return (
    <main className="space-y-8">
      <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300">
        最近文章
      </h2>
      {sortedPosts.map((post) => (
        <article
          key={post.slug}
          className="pb-6 border-b border-gray-200 dark:border-gray-700"
        >
          <a href={`/posts/${post.slug}`} className="block group">
            <h3 className="text-xl font-medium group-hover:text-purple-500 dark:group-hover:text-purple-300 transition-colors">
              {post.title}
            </h3>
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors">
              <time>{post.date || post.data}</time>
              <span className="mx-2">.</span>
              <span>{post.summary}</span>
            </div>
          </a>
        </article>
      ))}
    </main>
  );
}
