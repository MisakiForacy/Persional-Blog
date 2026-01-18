// src/pages/AboutMe.jsx
import { useState, useEffect } from 'react';
import ContributionHeatmap from '../components/ContributionHeatmap';
import { getCombinedContributions } from '../utils/contributionData';

export default function About() {
  const [contributionData, setContributionData] = useState({});
  const [availableYears, setAvailableYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getCombinedContributions('MisakiForacy', 'FXY_AC');
        setContributionData(data);

        // 从数据中提取所有年份并排序
        const yearsSet = new Set();
        Object.keys(data).forEach((dateStr) => {
          const year = parseInt(dateStr.split('-')[0]);
          yearsSet.add(year);
        });
        const years = Array.from(yearsSet).sort((a, b) => b - a);
        setAvailableYears(years);
        
        // 默认选择最新的年份
        if (years.length > 0) {
          setSelectedYear(years[0]);
        }
      } catch (err) {
        console.error('Error fetching contribution data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-6 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg shadow-md">
      <header className="text-center">
        <h1 className="text-3xl font-bold">关于我</h1>
        <div className="w-16 h-1 bg-gray-200 dark:bg-gray-700 mx-auto mt-4 rounded-full"></div>
      </header>

      <section className="prose prose-indigo prose-lg max-w-none leading-relaxed text-gray-900 dark:text-gray-100 space-y-4">
        <p>
          你好，我是 <strong>Foracy</strong>，一名热爱技术与思考的开发者。
        </p>

        <p>
          这个博客是我的个人空间，记录我在编程、技术和生活中的点滴感悟。
        </p>

        <p>
          <strong>我相信的：</strong><br />
          • 代码是逻辑的艺术<br />
          • 写作是思考的延伸<br />
          • 持续输出是最好的输入
        </p>

        <p>
          <strong>我擅长的：</strong><br />
          算法与数据结构 ➡️{' '}
          <a
            href="https://codeforces.com/profile/FXY_AC"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline dark:text-blue-400"
          >
            Codeforces 个人主页
          </a>
        </p>

        <div className="space-y-3 p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/60">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-gray-200 dark:bg-gray-700">
              <img
                src="/GitHub_Invertocat_Black.svg"
                alt="GitHub"
                className="w-6 h-6 block dark:hidden"
              />
              <img
                src="/GitHub_Invertocat_White.svg"
                alt="GitHub"
                className="w-6 h-6 hidden dark:block"
              />
            </div>
            <div>
              <h3 className="text-lg font-semibold">GitHub</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">代码、算法和实验项目都在这里</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {["React", "算法", "竞赛", "工具脚本", "可视化"].map((tag) => (
              <span key={tag} className="px-3 py-1 text-sm rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
                {tag}
              </span>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            <a
              href="https://github.com/MisakiForacy"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-500 transition"
            >
              访问 GitHub
            </a>
            <a
              href="https://github.com/MisakiForacy?tab=repositories"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            >
              查看仓库
            </a>
          </div>
        </div>

        <div className="space-y-3 p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/60">
          <h3 className="text-lg font-semibold">每日提交热力图</h3>
          {loading && <p className="text-gray-500 dark:text-gray-400">加载数据中...</p>}
          {error && <p className="text-red-500">错误: {error}</p>}
          {!loading && availableYears.length > 0 && (
            <ContributionHeatmap 
              data={contributionData} 
              availableYears={availableYears}
              selectedYear={selectedYear}
              onYearChange={setSelectedYear}
            />
          )}
          {!loading && availableYears.length === 0 && (
            <p className="text-gray-500 dark:text-gray-400">暂无数据</p>
          )}
        </div>

        <p>
          <strong>在探索的：</strong><br />
          <span className="flex flex-wrap gap-2">
            {['React', 'TypeScript', 'Tailwind CSS', 'Vite', 'Unity'].map((tech) => (
              <span key={tech} className="bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded text-sm">
                {tech}
              </span>
            ))}
          </span>
        </p>

        <div>
          <strong>如果你想联系我：</strong>
          <div className="mt-3 space-y-2">
            <div className="flex items-start gap-2">
              <span className="font-medium">📧 Email:</span>
              <div className="flex flex-wrap items-center gap-1">
                <a
                  href="mailto:fuxuanyu243@gmail.com"
                  className="text-blue-600 hover:underline dark:text-blue-400"
                >
                  fuxuanyu243@gmail.com
                </a>
                <span>or</span>
                <a
                  href="mailto:3208724733@qq.com"
                  className="text-blue-600 hover:underline dark:text-blue-400"
                >
                  3208724733@qq.com
                </a>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">📱 微信:</span>
              <span className="dark:text-gray-100">foracy34</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">📱 QQ:</span>
              <span className="dark:text-gray-100">3208724733</span>
            </div>
          </div>
        </div>

        <blockquote className="border-l-4 border-gray-300 pl-4 italic text-gray-600 dark:border-gray-500 dark:text-gray-400">
          “写作不是为了被看见，而是为了不被自己遗忘。”
        </blockquote>
      </section>
    </div>
  );
}