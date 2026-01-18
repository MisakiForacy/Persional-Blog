// src/App.jsx
import { Routes, Route, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Home from './pages/Home';
import PostPage from './pages/PostPage'; 
import Header from './components/Header';
import Footer from './components/Footer';
import PostContent from './components/PostContent';
import Upload from './pages/Upload';
import AboutMe from './pages/AboutMe';
import Profile from './pages/Profile';

export default function App() {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved === 'dark';
  });

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 200);
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
        <div className="max-w-2xl mx-auto px-4 py-6 w-full">
          <Header />
        </div>
      </header>
      <main className="flex-grow">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/posts/:slug" element={<PostPage />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/about" element={<AboutMe />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </div>
      </main>

      <footer className="shrink-0">
        <div className="max-w-2xl mx-auto px-4 py-6 w-full">
          <Footer />
        </div>
      </footer>

      {/* 浮动导航栏 - 向下滑动200px后显示 */}
      {showScrollTop && (
        <div className="fixed top-6 right-6 flex gap-1 z-40 bg-white/80 dark:bg-gray-800/80 rounded-full shadow-md p-1 backdrop-blur-sm border border-gray-200 dark:border-gray-700">
          <button
            onClick={() => (window.location.href = '/')}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
            aria-label="返回主页"
            title="返回主页"
          >
            {isDark ? (
              <svg className="w-6 h-6 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
            ) : (
              <svg className="w-6 h-6 text-green-700" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
            )}
          </button>

          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
            aria-label="切换主题"
          >
            {isDark ? (
              <svg className="w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-6 h-6 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            )}
          </button>

          <button
            onClick={() => (window.location.href = '/upload')}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
            aria-label="上传文章"
            title="上传文章"
          >
            {isDark ? (
              <svg className="w-6 h-6 text-blue-800" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M9.293 8.707a1 1 0 001.414 0l2.586-2.586A1 1 0 0012.586 4L11 5.586V2a1 1 0 10-2 0v3.586L7.414 4A1 1 0 105.707 6.12l2.586 2.586z" clipRule="evenodd" />
                <path d="M4 11a2 2 0 012-2h8a2 2 0 012 2v3a2 2 0 01-2 2H6a2 2 0 01-2-2v-3z" />
              </svg>
            ) : (
              <svg className="w-6 h-6 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M9.293 8.707a1 1 0 001.414 0l2.586-2.586A1 1 0 0012.586 4L11 5.586V2a1 1 0 10-2 0v3.586L7.414 4A1 1 0 105.707 6.12l2.586 2.586z" clipRule="evenodd" />
                <path d="M4 11a2 2 0 012-2h8a2 2 0 012 2v3a2 2 0 01-2 2H6a2 2 0 01-2-2v-3z" />
              </svg>
            )}
          </button>

          <button
              onClick={() => (window.location.href = '/profile')}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
              aria-label="个人主页"
              title="个人主页"
          >
              {isDark ? (
                <svg className="w-6 h-6 text-purple-300" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2.5a3.5 3.5 0 0 1 0 7 3.5 3.5 0 0 1 0-7zM4.5 15.2c0-2.4 2.7-3.7 5.5-3.7s5.5 1.3 5.5 3.7c0 .99-.27 1.6-.27 1.6H4.77s-.27-.61-.27-1.6z" />
                </svg>
              ) : (
                <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
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
          className="fixed bottom-8 right-8 p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 z-50"
          title="返回顶部"
          aria-label="返回顶部"
        >
          {isDark ? (
            // 向上箭头 - 深色模式
            <svg className="w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V15a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          ) : (
            // 向上箭头 - 浅色模式
            <svg className="w-6 h-6 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V15a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          )}
        </button>
      )}
    </div>
  );
}