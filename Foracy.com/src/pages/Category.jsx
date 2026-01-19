import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Header from '../components/Header';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const TAG_OPTIONS = [
  '算法',
  '数据结构',
  '竞赛',
  'Html/CSS',
  'React',
  'Vue',
  'Node.js',
  'JavaScript',
  'Python',
  'C/C++',
  'Rust',
  'Java',
  '人工智能',
  '机器学习',
  '深度学习',
  '强化学习',
  '数据库',
  '游戏设计',
  '随笔',
  '其他',
];

// 获取所有标签并分类
const getAllTags = () => {
  // 直接返回所有预定义的标签，保持原始顺序
  return TAG_OPTIONS;
};

// 获取特定标签的文章
const getPostsByTag = (postsData, tag) => {
  return postsData.filter((post) => {
    if (!post.tags || !Array.isArray(post.tags)) return false;
    return post.tags.some((t) => {
      if (tag === '其他') {
        // 匹配"其他"标签本身，或者任何非标准标签
        return t === '其他' || !TAG_OPTIONS.includes(t);
      }
      return t === tag;
    });
  });
};

export default function Category() {
  const { tag } = useParams();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const allTags = getAllTags();
  const selectedTag = tag || allTags[0] || '其他';
  const postsData = getPostsByTag(posts, selectedTag);

  // 从 API 获取文章列表
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/api/posts`);
        const data = await response.json();
        
        if (data.success && Array.isArray(data.posts)) {
          setPosts(data.posts);
        } else {
          setError('获取文章列表失败');
        }
      } catch (err) {
        console.error('获取文章失败:', err);
        setError('无法连接到服务器');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
      <main className="flex-1 px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">
            文章分类
          </h1>

          {/* 加载状态 */}
          {loading && (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                加载中...
              </p>
            </div>
          )}

          {/* 错误状态 */}
          {error && (
            <div className="text-center py-12">
              <p className="text-red-500 dark:text-red-400 text-lg">
                {error}
              </p>
            </div>
          )}

          {/* 标签导航和文章列表 */}
          {!loading && !error && (
            <>

          {/* 标签导航 - 悬浮气泡 */}
          <div className="mb-8 flex flex-wrap gap-3">
            {allTags.map((t) => (
              <button
                key={t}
                onClick={() => navigate(`/cate/${encodeURIComponent(t)}`)}
                className={`px-5 py-2 rounded-full font-medium transition-all duration-300 transform hover:scale-110 cursor-pointer ${
                  selectedTag === t
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg scale-105 border border-blue-300'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500 shadow-sm hover:shadow-md'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* 文章列表 */}
          <div className="space-y-4">
            {postsData.length > 0 ? (
              postsData.map((post) => (
                <article
                  key={post.slug}
                  className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md dark:hover:shadow-gray-800 transition-shadow cursor-pointer group"
                  onClick={() => navigate(`/posts/${post.slug}`)}
                >
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm">
                    {post.summary}
                  </p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-gray-500 dark:text-gray-500 text-xs">
                      {post.date}
                    </span>
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 justify-end">
                        {post.tags.map((tag) => {
                          const displayTag =
                            TAG_OPTIONS.includes(tag) ? tag : '其他';
                          return (
                            <span
                              key={tag}
                              className="px-3 py-1 text-xs font-medium rounded-full bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-700 dark:to-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-600 shadow-sm hover:shadow-md transition-shadow"
                            >
                              {displayTag}
                            </span>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </article>
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400 text-lg">
                  该分类下暂无文章
                </p>
              </div>
            )}
          </div>
          </>
          )}
        </div>
      </main>
    </div>
  );
}
