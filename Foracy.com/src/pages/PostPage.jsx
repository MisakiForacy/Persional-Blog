// src/pages/PostPage.jsx
import { useParams } from 'react-router-dom';
import { posts } from '../posts/meta'; // ← 你的文章元数据
import { useEffect, useState } from 'react';
import PostContent from '../components/PostContent';

export default function PostPage() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. 找到匹配的文章元数据
    const found = posts.find(p => p.slug === slug);
    if (!found) {
      setPost(null);
      setLoading(false);
      return;
    }
    setPost(found);

    // 2. 动态导入对应的 Markdown 文件（需 Vite 支持）
    import(`../posts/${slug}.md?raw`)
      .then(mod => {
        setContent(mod.default);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load post:', err);
        setContent('# 文章未找到\n\n抱歉，该文章不存在。');
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center text-gray-600 dark:text-gray-400">
        加载中...
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12 text-center text-gray-600 dark:text-gray-400">
        文章不存在
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <article className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
        <header className="mb-8 border-b border-gray-200 dark:border-gray-700 pb-6 flex space-x-2">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">
            {post.title}
          </h1>
          <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
            <time>{post.date}</time>
            {post.summary && (
              <span className="italic">{post.summary}</span>
            )}
          </div>
        </header>
        <PostContent content={content} />
      </article>
    </div>
  );
}