import { useState, useEffect } from 'react';

export default function Header() {
  const [isDark, setIsDark] = useState(() => {
    // 从 localStorage 读取主题设置，默认为 false (浅色)
    const saved = localStorage.getItem('theme');
    return saved === 'dark';
  });

  useEffect(() => {
    // 更新 html 元素的 class
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  return (
    <header className="flex items-center justify-between gap-2">
      <a href="/about" className="flex items-center gap-2">
        <img
          src="/icons/img.png"
          alt="Profile Picture"
          className="rounded-full w-12 h-12"
        />
        <div className="flex-col space-y-2">
          <h1 className="text-gray-600 dark:text-gray-400">Foracy's Blog</h1>
          <p className="text-gray-500 dark:text-gray-150">
            My Utopia: Focus Only On Technology And Love
          </p>
        </div>
      </a>

      <div className="flex items-center gap-2">
        <button
          onClick={() => (window.location.href = '/')}
          className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
          aria-label="返回主页"
          title="返回主页"
        >
          {isDark ? (
            // 主页图标 - 深色模式
            <svg
              className="w-6 h-6 text-green-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
          ) : (
            // 主页图标 - 浅色模式
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
          className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 
                            transition-colors duration-200"
          aria-label="切换主题"
          title="切换主题"
        >
          {isDark ? (
            // 太阳图标 (浅色模式)
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
            // 月亮图标 (深色模式)
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
          className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
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
          onClick={() => (window.location.href = '/cate')}
          className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
          aria-label="文章分类"
          title="文章分类"
        >
          {isDark ? (
            <svg
              className="w-6 h-6 text-cyan-300"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
            </svg>
          ) : (
            <svg
              className="w-6 h-6 text-cyan-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
            </svg>
          )}
        </button>

        <button
          onClick={() => (window.location.href = '/profile')}
          className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
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
    </header>
  );
}
