// src/pages/Profile.jsx
import { useState, useEffect } from 'react';
import ContributionHeatmap from '../components/ContributionHeatmap';
import { getCombinedContributions } from '../utils/contributionData';
import { posts } from '../posts/meta';

// Codeforces rating颜色映射
const getRatingColor = (rating) => {
  if (!rating) return '#808080'; // 灰色 - Unrated
  if (rating < 1200) return '#808080'; // 灰色 - Newbie
  if (rating < 1400) return '#008000'; // 绿色 - Pupil
  if (rating < 1600) return '#03A89E'; // 青色 - Specialist
  if (rating < 1900) return '#0000FF'; // 蓝色 - Expert
  if (rating < 2100) return '#AA00AA'; // 紫色 - Candidate Master
  if (rating < 2300) return '#FF8C00'; // 橙色 - Master
  if (rating < 2400) return '#FF8C00'; // 橙色 - International Master
  if (rating < 2600) return '#FF0000'; // 红色 - Grandmaster
  if (rating < 3000) return '#FF0000'; // 红色 - International Grandmaster
  return '#AA0000'; // 深红色 - Legendary Grandmaster
};

export default function Profile() {
  const [contributionData, setContributionData] = useState({});
  const [availableYears, setAvailableYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [githubUser, setGithubUser] = useState(null);
  const [codeforcesUser, setCodeforcesUser] = useState(null);
  // 已移除 LeetCode 卡片

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // 从后端获取博客提交历史记录
        let blogData = {};
        try {
          const response = await fetch('http://localhost:3001/api/blog-submissions');
          if (response.ok) {
            const data = await response.json();
            blogData = data.submissions || {};
          }
        } catch (err) {
          console.warn('Failed to fetch blog submissions history:', err);
          // 降级：如果历史记录API不可用，使用当前posts数据
          blogData = posts.reduce((acc, post) => {
            const raw = post.date || '';
            const dateOnly = raw.split(' ')[0];
            if (dateOnly) {
              acc[dateOnly] = (acc[dateOnly] || 0) + 1;
            }
            return acc;
          }, {});
        }

        const data = await getCombinedContributions(
          'MisakiForacy',
          'FXY_AC',
          blogData
        );
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

        // 获取GitHub用户信息
        const githubResponse = await fetch(
          'https://api.github.com/users/MisakiForacy'
        );
        if (githubResponse.ok) {
          const githubData = await githubResponse.json();
          setGithubUser(githubData);
        }

        // 获取Codeforces用户信息
        const cfResponse = await fetch(
          'https://codeforces.com/api/user.info?handles=FXY_AC'
        );
        if (cfResponse.ok) {
          const cfData = await cfResponse.json();
          if (cfData.status === 'OK' && cfData.result.length > 0) {
            setCodeforcesUser(cfData.result[0]);
          }
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
        <h1 className="text-3xl font-bold">个人名片</h1>
        <div className="w-16 h-1 bg-gray-200 dark:bg-gray-700 mx-auto mt-4 rounded-full"></div>
      </header>

      <section className="space-y-6">
        {/* GitHub 名片 */}
        <div className="space-y-3 p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/60">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-gray-200 dark:bg-gray-700">
                <img
                  src="/icons/GitHub_Invertocat_Black.svg"
                  alt="GitHub"
                  className="w-6 h-6 block dark:hidden"
                />
                <img
                  src="/icons/GitHub_Invertocat_White.svg"
                  alt="GitHub"
                  className="w-6 h-6 hidden dark:block"
                />
              </div>
              <div>
                <h3 className="text-lg font-semibold">GitHub</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  代码、算法和实验项目都在这里
                </p>
              </div>
            </div>
            {githubUser && (
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-lg font-semibold">{githubUser.login}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {githubUser.name || ''}
                  </p>
                </div>
                <img
                  src={githubUser.avatar_url}
                  alt={githubUser.login}
                  className="w-16 h-16 rounded-full border-2 border-gray-300 dark:border-gray-600"
                />
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {['React', '算法', '竞赛', '工具脚本', '可视化'].map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 text-sm rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
              >
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

        {/* Codeforces 名片 */}
        <div className="space-y-3 p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/60">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900">
                <img
                  src="/icons/code-forces.svg"
                  alt="Codeforces"
                  className="w-6 h-6"
                />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Codeforces</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  算法竞赛与练习记录
                </p>
              </div>
            </div>
            {codeforcesUser && (
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p
                    className="text-lg font-semibold"
                    style={{ color: getRatingColor(codeforcesUser.rating) }}
                  >
                    {codeforcesUser.handle}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {codeforcesUser.rank || 'Unrated'} (
                    {codeforcesUser.rating || 0})
                  </p>
                </div>
                <img
                  src={codeforcesUser.titlePhoto}
                  alt={codeforcesUser.handle}
                  className="w-16 h-16 rounded-full border-2 border-gray-300 dark:border-gray-600"
                />
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {['Codeforces', '算法', '竞赛', '数据结构', '刷题'].map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 text-sm rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            <a
              href="https://codeforces.com/profile/FXY_AC"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-500 transition"
            >
              访问 Codeforces
            </a>
            <a
              href="https://codeforces.com/submissions/FXY_AC"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            >
              查看提交
            </a>
          </div>
        </div>

        {/* 热力图 */}
        <div className="space-y-3 p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/60">
          <h3 className="text-lg font-semibold">每日提交热力图</h3>
          {loading && (
            <p className="text-gray-500 dark:text-gray-400">加载数据中...</p>
          )}
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
      </section>
    </div>
  );
}
