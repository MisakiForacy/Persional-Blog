import { useState } from 'react';

export default function ContributionHeatmap({
  data = {},
  className = '',
  availableYears = [],
  selectedYear = null,
  onYearChange = null,
}) {
  const today = new Date();
  const [internalSelectedYear, setInternalSelectedYear] = useState(
    selectedYear !== null ? selectedYear : today.getFullYear()
  );

  // 如果有外部的年份控制，使用外部的；否则使用内部状态
  const currentYear =
    selectedYear !== null ? selectedYear : internalSelectedYear;
  const handleYearChange = (year) => {
    if (onYearChange) {
      onYearChange(year);
    } else {
      setInternalSelectedYear(year);
    }
  };

  const monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getYearData = (year) => {
    // 使用字符串方式创建日期，避免时区问题
    const jan1 = new Date(`${year}-01-01T00:00:00Z`);
    const dec31 = new Date(`${year}-12-31T23:59:59Z`);
    const jan1DayOfWeek = jan1.getDay(); // 0=Sun, 1=Mon, ..., 6=Sat

    // 生成完整的日期数组，包括前导空格
    const allCells = [];

    // 前导空格：Jan1前的天数
    for (let i = 0; i < jan1DayOfWeek; i++) {
      allCells.push(null);
    }

    // 添加该年所有日期（从1月1日到12月31日）
    const clsByLevel = [
      'bg-gray-100 dark:bg-gray-800',
      'bg-green-200 dark:bg-green-900',
      'bg-green-400 dark:bg-green-700',
      'bg-green-500 dark:bg-green-600',
      'bg-green-700 dark:bg-green-500',
    ];

    for (let month = 0; month < 12; month++) {
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const dateData = data[dateStr];
        // 处理两种数据格式：新的结构化格式和旧的简单数字格式
        const count =
          typeof dateData === 'object' ? dateData?.total || 0 : dateData || 0;
        let level = 0;
        if (count >= 1 && count <= 3) level = 1;
        else if (count >= 4 && count <= 6) level = 2;
        else if (count >= 7 && count <= 9) level = 3;
        else if (count >= 10) level = 4;

        const dateObj = new Date(`${dateStr}T00:00:00Z`);
        allCells.push({
          date: dateStr,
          count,
          level,
          cls: clsByLevel[level],
          dayOfWeek: dateObj.getDay(),
          details: typeof dateData === 'object' ? dateData : null,
        });
      }
    }

    // 后导空格：补齐最后一周
    while (allCells.length % 7 !== 0) {
      allCells.push(null);
    }

    // 分组成列（每列7行）
    const columns = [];
    const monthLabels = [];

    for (let i = 0; i < allCells.length; i += 7) {
      const column = allCells.slice(i, i + 7);
      columns.push(column);

      // 检查该列是否包含某月的1日
      let monthLabel = '';
      for (let j = 0; j < column.length; j++) {
        const cell = column[j];
        if (cell && cell.date) {
          const parts = cell.date.split('-');
          if (parseInt(parts[2]) === 1) {
            // 是该月的1日
            monthLabel = monthNames[parseInt(parts[1]) - 1];
            break;
          }
        }
      }
      monthLabels.push(monthLabel);
    }

    return { columns, monthLabels };
  };

  const { columns, monthLabels } = getYearData(currentYear);
  const yearsToDisplay =
    availableYears.length > 0 ? availableYears : [today.getFullYear()];

  return (
    <div className={`space-y-3 ${className}`}>
      {/* 年份选择器 */}
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">
          年份：
        </span>
        <div className="flex gap-2">
          {yearsToDisplay.map((year) => (
            <button
              key={year}
              onClick={() => handleYearChange(year)}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                currentYear === year
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {year}
            </button>
          ))}
        </div>
      </div>

      {/* 热力图容器 */}
      <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-3">
        {/* 统一滚动容器 */}
        <div className="overflow-x-auto" style={{ overflowY: 'hidden' }}>
          <style>{`
            div::-webkit-scrollbar {
              height: 8px;
            }
            div::-webkit-scrollbar-track {
              background: transparent;
            }
            div::-webkit-scrollbar-thumb {
              background: #ccc;
              border-radius: 4px;
            }
            div::-webkit-scrollbar-thumb:hover {
              background: #999;
            }
          `}</style>
          <div className="min-w-max">
            {/* 月份标签 */}
            <div className="flex items-center">
              <div className="w-8" />
              <div className="inline-flex gap-[3px] text-xs text-gray-500 dark:text-gray-400 select-none">
                {monthLabels.map((m, i) => (
                  <div key={`m-${i}`} className="w-3 text-center">
                    {m}
                  </div>
                ))}
              </div>
            </div>

            {/* 星期标签 + 热力网格 */}
            <div className="flex items-start gap-2">
              <div className="flex flex-col gap-[3px] mt-1 text-xs text-gray-500 dark:text-gray-400 select-none w-8">
                {dayLabels.map((day, idx) => (
                  <div
                    key={`d-${idx}`}
                    className="h-3 flex items-center justify-end pr-1"
                  >
                    {idx % 2 === 0 ? day : ''}
                  </div>
                ))}
              </div>

              <div
                className="inline-flex gap-[3px] select-none"
                aria-label="Contribution heatmap"
              >
                {columns.map((col, i) => (
                  <div key={i} className="flex flex-col gap-[3px]">
                    {col.map((cell, idx) => {
                      let tooltipText = '';
                      if (cell) {
                        if (cell.details) {
                          tooltipText = `${cell.date}\nBlog: ${cell.details.blog || 0} 次\nGitHub: ${cell.details.github} 次\nCodeforces: ${cell.details.codeforces} 次`;
                        } else {
                          tooltipText = `${cell.date} • ${cell.count} 次提交`;
                        }
                      }
                      return (
                        <div
                          key={`${i}-${idx}`}
                          className={
                            cell === null
                              ? 'w-3 h-3 rounded-[1px] bg-transparent'
                              : `w-3 h-3 rounded-[1px] border border-gray-300/60 dark:border-gray-700 ${cell.cls} transition-colors duration-200 cursor-help`
                          }
                          title={tooltipText}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 图例 */}
      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
        <span>Less</span>
        <span className="w-3 h-3 rounded-[1px] border border-gray-300/60 dark:border-gray-700 bg-gray-100 dark:bg-gray-800" />
        <span className="w-3 h-3 rounded-[1px] border border-gray-300/60 dark:border-gray-700 bg-green-200 dark:bg-green-900" />
        <span className="w-3 h-3 rounded-[1px] border border-gray-300/60 dark:border-gray-700 bg-green-400 dark:bg-green-700" />
        <span className="w-3 h-3 rounded-[1px] border border-gray-300/60 dark:border-gray-700 bg-green-500 dark:bg-green-600" />
        <span className="w-3 h-3 rounded-[1px] border border-gray-300/60 dark:border-gray-700 bg-green-700 dark:bg-green-500" />
        <span>More</span>
      </div>
    </div>
  );
}
