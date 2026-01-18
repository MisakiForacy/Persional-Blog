/**
 * 获取GitHub提交记录
 * @param {string} username - GitHub用户名
 * @returns {Promise<Object>} 日期->提交数的映射
 */
export async function getGithubContributions(username) {
  try {
    // 使用GitHub的contributions API（需要从页面解析，或使用GraphQL）
    // 这里使用一个社区提供的API服务
    const response = await fetch(
      `https://api.github.com/users/${username}/repos?per_page=100&type=owner`
    );
    const repos = await response.json();

    if (!Array.isArray(repos)) {
      console.error('GitHub repos response is not an array:', repos);
      return {};
    }

    const contributionMap = {};

    // 对每个repo获取提交记录
    for (const repo of repos) {
      try {
        const commitsUrl = `https://api.github.com/repos/${username}/${repo.name}/commits?per_page=100`;
        const commitsResponse = await fetch(commitsUrl);
        const commits = await commitsResponse.json();

        // 如果是数组，说明成功获取
        if (Array.isArray(commits)) {
          commits.forEach((commit) => {
            // GitHub API可能返回null的author
            if (commit.commit && commit.commit.author) {
              const dateStr = commit.commit.author.date.split('T')[0]; // YYYY-MM-DD
              contributionMap[dateStr] = (contributionMap[dateStr] || 0) + 1;
            }
          });
        }
      } catch (err) {
        console.warn(`Failed to fetch commits for ${repo.name}:`, err);
      }
    }

    console.log('GitHub contributions loaded:', Object.keys(contributionMap).length, 'dates');
    return contributionMap;
  } catch (err) {
    console.error('Failed to fetch GitHub contributions:', err);
    return {};
  }
}

/**
 * 获取Codeforces提交记录
 * @param {string} username - Codeforces用户名
 * @returns {Promise<Object>} 日期->提交数的映射
 */
export async function getCodeforcesSubmissions(username) {
  try {
    const response = await fetch(
      `https://codeforces.com/api/user.status?handle=${username}`
    );
    const data = await response.json();

    const submissionMap = {};

    if (data.status === 'OK' && Array.isArray(data.result)) {
      data.result.forEach((submission) => {
        const timestamp = submission.creationTimeSeconds * 1000;
        const dateObj = new Date(timestamp);
        // 转换为本地时间的日期字符串
        const year = dateObj.getUTCFullYear();
        const month = String(dateObj.getUTCMonth() + 1).padStart(2, '0');
        const day = String(dateObj.getUTCDate()).padStart(2, '0');
        const dateStr = `${year}-${month}-${day}`;
        submissionMap[dateStr] = (submissionMap[dateStr] || 0) + 1;
      });
    }

    console.log('Codeforces submissions loaded:', Object.keys(submissionMap).length, 'dates');
    return submissionMap;
  } catch (err) {
    console.error('Failed to fetch Codeforces submissions:', err);
    return {};
  }
}

/**
 * 合并GitHub和Codeforces的提交记录
 * @param {string} githubUsername - GitHub用户名
 * @param {string} codeforcesUsername - Codeforces用户名
 * @param {Object} blogData - 可选的博客数据，格式为 {YYYY-MM-DD: count}
 * @returns {Promise<Object>} 合并后的日期->数据映射，包含blog、github和codeforces数据
 */
export async function getCombinedContributions(
  githubUsername,
  codeforcesUsername,
  blogData = {}
) {
  const [githubData, codeforcesData] = await Promise.all([
    getGithubContributions(githubUsername),
    getCodeforcesSubmissions(codeforcesUsername),
  ]);

  // 创建一个结构化的数据，包含分别的计数
  const combined = {};

  // 合并所有日期
  const allDates = new Set([
    ...Object.keys(githubData),
    ...Object.keys(codeforcesData),
    ...Object.keys(blogData),
  ]);

  allDates.forEach((date) => {
    const blog = blogData[date] || 0;
    const github = githubData[date] || 0;
    const codeforces = codeforcesData[date] || 0;
    combined[date] = {
      blog,
      github,
      codeforces,
      total: blog + github + codeforces,
    };
  });

  console.log('Combined total dates:', Object.keys(combined).length);
  console.log(
    'Combined data sample:',
    Object.entries(combined).slice(0, 10)
  );

  return combined;
}
