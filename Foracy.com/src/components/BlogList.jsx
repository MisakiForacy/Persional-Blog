import { useState, useEffect } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export default function BlogList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 从数据库加载文章列表
    const fetchPosts = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/posts`);
        if (!response.ok) {
          throw new Error(`Failed to fetch posts: ${response.statusText}`);
        }
        const data = await response.json();
        
        if (!data.success || !data.posts) {
          throw new Error('Invalid response format');
        }

        setPosts(data.posts);
        setLoading(false);
      } catch (error) {
        console.error('Failed to load posts:', error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <main className="space-y-8">
        <div className="text-center text-gray-500 dark:text-gray-400">
          加载中...
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="space-y-8">
        <div className="text-center text-red-500 dark:text-red-400">
          加载失败：{error}
        </div>
      </main>
    );
  }

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
