// src/App.jsx
import { Routes, Route, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Home from './pages/Home';
import PostPage from './pages/PostPage';
import Header from './components/Header';
import Footer from './components/Footer';
import AboutMe from './pages/AboutMe';
import Profile from './pages/Profile';
import Editor from './pages/Editor';
import Category from './pages/Category';

export default function App() {
  const location = useLocation();
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved === 'dark';
  });

  // 根据路由动态设置主容器宽度
  const isEditorPage = location.pathname === '/editor';
  const maxWidthClass = isEditorPage ? 'max-w-full' : 'max-w-6xl';

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'));
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributes: true });
    return () => observer.disconnect();
  }, []);

  const toggleTheme = () => {
    const newDark = !isDark;
    setIsDark(newDark);
    if (newDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div
      className="flex flex-col 
                min-h-screen bg-white-100 
                dark:bg-gray-900 text-gray-900 
                dark:text-gray-100"
    >
      <header>
        <div className="max-w-4xl mx-auto px-4 py-6 w-full">
          <Header />
        </div>
      </header>
      <main className="flex-grow">
        <div className={`${maxWidthClass} mx-auto px-4 py-8 rounded-lg`}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/posts/:slug" element={<PostPage />} />
            <Route path="/about" element={<AboutMe />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/editor" element={<Editor />} />
            <Route path="/cate" element={<Category />} />
            <Route path="/cate/:tag" element={<Category />} />
          </Routes>
        </div>
      </main>

      <footer className="shrink-0">
        <div className="max-w-2xl mx-auto px-4 py-6 w-full">
          <Footer />
        </div>
      </footer>

      {/* 浮动品牌标识 - 向下滑动200px后显示 */}
      {showScrollTop && (
        <a
          href="/about"
          className="fixed top-6 left-6 z-40 flex items-center gap-2 bg-white/90 dark:bg-gray-800/90 px-3 py-2 rounded-xl shadow-md backdrop-blur-sm border border-gray-200 dark:border-gray-700 transition-all duration-500"
          style={{
            animation: 'slideFromHeader 0.6s ease-out forwards'
          }}
        >
          <img
            src="/icons/img.png"
            alt="Profile Picture"
            className="rounded-full w-10 h-10"
          />
          <div className="flex-col space-y-1">
            <h1 className="text-gray-700 dark:text-gray-200 text-lg font-semibold">Foracy's Blog</h1>
            <p className="text-gray-500 dark:text-gray-300 text-xs leading-4">
              My Utopia: Focus Only On Technology And Love
            </p>
          </div>
        </a>
      )}

      {/* 浮动导航栏 - 向下滑动200px后显示 */}
      {showScrollTop && (
        <div className="fixed top-6 right-6 flex gap-2 z-40 bg-white/80 dark:bg-gray-800/80 rounded-full shadow-md px-2 py-1 backdrop-blur-sm border border-gray-200 dark:border-gray-700 transition-all duration-500" style={{
          animation: 'slideFromHeaderRight 0.6s ease-out forwards'
        }}>
          <style>{`
            @keyframes fadeInScale {
              from {
                opacity: 0;
                transform: scale(0.95);
              }
              to {
                opacity: 1;
                transform: scale(1);
              }
            }
            @keyframes slideFromHeader {
              from {
                opacity: 0;
                transform: translateY(-180px) translateX(calc(50vw - 50%)) scale(1.1);
              }
              to {
                opacity: 1;
                transform: translateY(0) translateX(0) scale(1);
              }
            }
            @keyframes slideFromHeaderRight {
              from {
                opacity: 0;
                transform: translateY(-180px) translateX(calc(-50vw + 50%)) scale(1.05);
              }
              to {
                opacity: 1;
                transform: translateY(0) translateX(0) scale(1);
              }
            }
          `}</style>
          <button
            onClick={() => (window.location.href = '/')}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300"
            aria-label="返回主页"
            title="返回主页"
          >
            {isDark ? (
              <svg
                className="w-6 h-6 text-green-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
            ) : (
              <svg
                className="w-6 h-6 text-green-700"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
            )}
          </button>

          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300"
            aria-label="切换主题"
            title="切换主题"
          >
            {isDark ? (
              <svg
                className="w-6 h-6 text-yellow-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg
                className="w-6 h-6 text-gray-700"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            )}
          </button>

          <button
            onClick={() => (window.location.href = '/editor')}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300"
            aria-label="在线编辑"
            title="在线编辑"
          >
            {isDark ? (
              <svg
                className="w-6 h-6 text-blue-300"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M4 13.5V16h2.5L15 7.5 12.5 5 4 13.5z" />
                <path d="M16.414 6.414a1 1 0 000-1.414l-1.414-1.414a1 1 0 00-1.414 0L12.5 4.672 15.328 7.5l1.086-1.086z" />
              </svg>
            ) : (
              <svg
                className="w-6 h-6 text-blue-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M4 13.5V16h2.5L15 7.5 12.5 5 4 13.5z" />
                <path d="M16.414 6.414a1 1 0 000-1.414l-1.414-1.414a1 1 0 00-1.414 0L12.5 4.672 15.328 7.5l1.086-1.086z" />
              </svg>
            )}
          </button>

          <button
            onClick={() => (window.location.href = '/profile')}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300"
            aria-label="个人主页"
            title="个人主页"
          >
            {isDark ? (
              <svg
                className="w-6 h-6 text-purple-300"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 2.5a3.5 3.5 0 0 1 0 7 3.5 3.5 0 0 1 0-7zM4.5 15.2c0-2.4 2.7-3.7 5.5-3.7s5.5 1.3 5.5 3.7c0 .99-.27 1.6-.27 1.6H4.77s-.27-.61-.27-1.6z" />
              </svg>
            ) : (
              <svg
                className="w-6 h-6 text-purple-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 2.5a3.5 3.5 0 0 1 0 7 3.5 3.5 0 0 1 0-7zM4.5 15.2c0-2.4 2.7-3.7 5.5-3.7s5.5 1.3 5.5 3.7c0 .99-.27 1.6-.27 1.6H4.77s-.27-.61-.27-1.6z" />
              </svg>
            )}
          </button>
        </div>
      )}

      {/* 返回顶部按钮 */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 z-50"
          title="返回顶部"
          aria-label="返回顶部"
          style={{
            animation: 'fadeInUp 0.5s ease-out forwards'
          }}
        >
          <style>{`
            @keyframes fadeInUp {
              from {
                opacity: 0;
                transform: translateY(20px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
          `}</style>
          {isDark ? (
            // 向上箭头 - 深色模式
            <svg
              className="w-6 h-6 text-yellow-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V15a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            // 向上箭头 - 浅色模式
            <svg
              className="w-6 h-6 text-gray-700"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V15a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </button>
      )}
    </div>
  );
}
