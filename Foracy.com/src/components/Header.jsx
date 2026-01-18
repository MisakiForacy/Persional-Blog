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
            <a href="/" className="flex items-center gap-2">
                <img 
                    src="/img.png" 
                    alt="Profile Picture" 
                    className="rounded-full w-12 h-12" 
                /> 
                <div className="flex-col space-y-0">
                    <h1 className="text-gray-600 dark:text-gray-400"> 
                        Foracy's Blog 
                    </h1>
                    <p className="text-gray-500 dark:text-gray-150">An Utopia Only For Me, Focus On Technology And Love</p>
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
                        <svg className="w-6 h-6 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                        </svg>
                    ) : (
                        // 主页图标 - 浅色模式
                        <svg className="w-6 h-6 text-green-700" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                        </svg>
                    )}
                </button>

                <button
                    onClick={toggleTheme}
                    className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 
                            transition-colors duration-200"
                    aria-label="切换主题"
                >
                    {isDark ? (
                        // 太阳图标 (浅色模式)
                        <svg className="w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                        </svg>
                    ) : (
                        // 月亮图标 (深色模式)
                        <svg className="w-6 h-6 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                        </svg>
                    )}
                </button>

                <button
                    onClick={() => (window.location.href = '/upload')}
                    className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
                    aria-label="上传文章"
                    title="上传文章"
                >
                    {isDark ? (
                        // 上传图标 - 深色模式
                        <svg className="w-6 h-6 text-blue-800" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M9.293 8.707a1 1 0 001.414 0l2.586-2.586A1 1 0 0012.586 4L11 5.586V2a1 1 0 10-2 0v3.586L7.414 4A1 1 0 105.707 6.12l2.586 2.586z" clipRule="evenodd" />
                            <path d="M4 11a2 2 0 012-2h8a2 2 0 012 2v3a2 2 0 01-2 2H6a2 2 0 01-2-2v-3z" />
                        </svg>
                    ) : (
                        // 上传图标 - 浅色模式
                        <svg className="w-6 h-6 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M9.293 8.707a1 1 0 001.414 0l2.586-2.586A1 1 0 0012.586 4L11 5.586V2a1 1 0 10-2 0v3.586L7.414 4A1 1 0 105.707 6.12l2.586 2.586z" clipRule="evenodd" />
                            <path d="M4 11a2 2 0 012-2h8a2 2 0 012 2v3a2 2 0 01-2 2H6a2 2 0 01-2-2v-3z" />
                        </svg>
                    )}
                </button>
            </div>
        </header> 
    ); 
}