// src/pages/PostPage.jsx
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import PostContent from '../components/PostContent';

const API_BASE_URL = 'http://localhost:3001';

export default function PostPage() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    // 从数据库读取文章
    const fetchPost = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/posts`);
        if (!response.ok) {
          throw new Error(`Failed to fetch posts: ${response.statusText}`);
        }
        const data = await response.json();
        
        if (!data.success || !data.posts) {
          throw new Error('Invalid response format');
        }

        // 查找匹配的文章
        const found = data.posts.find((p) => p.slug === slug);
        
        if (!found) {
          setPost(null);
          setContent('# 文章未找到\n\n抱歉，该文章不存在。');
          setLoading(false);
          return;
        }

        setPost(found);
        setContent(found.content || '');
        setLoading(false);
      } catch (error) {
        console.error('Failed to load post:', error);
        setPost(null);
        setContent('# 加载失败\n\n抱歉，无法加载文章内容。');
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  const handleDelete = async () => {
    const adminKey = prompt('请输入管理员密钥以删除文章');
    if (!adminKey) return;

    try {
      const response = await fetch(
        `http://localhost:3001/api/posts/${slug}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${adminKey.trim()}`,
          },
        }
      );

      if (response.ok) {
        alert('文章已删除');
        window.location.href = '/';
      } else {
        alert('删除失败，请检查密钥');
      }
    } catch (error) {
      console.error('删除失败:', error);
      alert('删除失败：' + error.message);
    }
    setShowDeleteModal(false);
  };
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
        <header className="mb-8 border-b border-gray-200 dark:border-gray-700 pb-6 flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">
              {post.title}
            </h1>
            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
              <time>{post.date}</time>
              {post.summary && <span className="italic">{post.summary}</span>}
            </div>
          </div>
          <div className="flex gap-2 ml-4">
            <button
              onClick={() => (window.location.href = '/editor?edit=' + slug)}
              className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
              title="编辑文章"
            >
              <svg
                className="w-5 h-5 text-blue-600 dark:text-blue-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M4 13.5V16h2.5L15 7.5 12.5 5 4 13.5z" />
                <path d="M16.414 6.414a1 1 0 000-1.414l-1.414-1.414a1 1 0 00-1.414 0L12.5 4.672 15.328 7.5l1.086-1.086z" />
              </svg>
            </button>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900 transition-colors duration-200"
              title="删除文章"
            >
              <svg
                className="w-5 h-5 text-red-600 dark:text-red-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </header>
        <PostContent content={content} />
      </article>

      {/* 删除确认弹窗 */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
              确认删除文章？
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              此操作不可撤销，文章将永久删除。
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 transition-colors duration-200"
              >
                取消
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700 text-white transition-colors duration-200 font-medium"
              >
                确认删除
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
