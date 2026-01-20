import { useEffect, useMemo, useState, useCallback, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import PostContent from '../components/PostContent';
import Header from '../components/Header';

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

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
const DRAFT_KEY = 'blog_editor_draft';

export default function Editor() {
  const [searchParams] = useSearchParams();
  const editSlug = searchParams.get('edit');
  const fileInputRef = useRef(null);
  const isEditMode = !!editSlug;

  const [slug, setSlug] = useState('');
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [content, setContent] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [uploading, setUploading] = useState(false);
  const [loadingId, setLoadingId] = useState(false);
  const [showTagModal, setShowTagModal] = useState(false);
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [tempKey, setTempKey] = useState('');
  const [customTag, setCustomTag] = useState('');
  const [editorWidthPercent, setEditorWidthPercent] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [fontSize, setFontSize] = useState(14);
  const [tabSize, setTabSize] = useState(2);

  // 初始化状态：优先从 localStorage 恢复草稿
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e) => {
      const container = document.getElementById('editor-container');
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const newPercent = Math.max(
        20,
        Math.min(80, ((e.clientX - rect.left) / rect.width) * 100)
      );
      setEditorWidthPercent(newPercent);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  const hasContent = content.trim().length > 0;

  const fetchNextId = useCallback(async () => {
    setLoadingId(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/next-id`);
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.nextId) {
          setSlug(data.nextId);
        }
      }
    } catch (error) {
      console.error('获取ID失败:', error);
      setMessage({ type: 'error', text: '获取文章ID失败，请检查后端服务' });
    } finally {
      setLoadingId(false);
    }
  }, []);

  // 从 localStorage 恢复草稿或加载编辑内容（只执行一次）
  useEffect(() => {
    if (initialized) return; // 已初始化则跳过
    
    console.log('初始化编辑器, isEditMode:', isEditMode, 'editSlug:', editSlug);
    
    if (isEditMode && editSlug) {
      // 编辑模式：从数据库加载文章
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
          const found = data.posts.find((p) => p.slug === editSlug);
          
          if (!found) {
            setMessage({ type: 'error', text: '文章不存在' });
            setInitialized(true);
            return;
          }

          setSlug(found.slug);
          setTitle(found.title);
          setSummary(found.summary || '');
          setSelectedTags(found.tags || []);
          setContent(found.content || '');
          setInitialized(true);
          console.log('✓ 编辑模式：文章已从数据库加载');
        } catch (error) {
          console.error('加载文章内容失败:', error);
          setMessage({ type: 'error', text: '加载文章内容失败' });
          setInitialized(true);
        }
      };
      
      fetchPost();
      return;
    }
    
    // 新建模式：优先从 localStorage 恢复草稿
    const savedDraft = localStorage.getItem(DRAFT_KEY);
    console.log('检查草稿:', savedDraft ? '找到草稿' : '无草稿');
    
    if (savedDraft) {
      try {
        const draft = JSON.parse(savedDraft);
        console.log('恢复草稿内容:', { slug: draft.slug, title: draft.title, contentLength: draft.content?.length });
        setSlug(draft.slug || '');
        setTitle(draft.title || '');
        setSummary(draft.summary || '');
        setSelectedTags(draft.selectedTags || []);
        setContent(draft.content || '');
        setInitialized(true);
        console.log('✓ 草稿已恢复');
      } catch (err) {
        console.warn('草稿恢复失败:', err);
        fetchNextId();
        setInitialized(true);
      }
    } else {
      // 没有草稿时获取新ID
      console.log('无草稿，获取新ID');
      fetchNextId();
      setInitialized(true);
    }
  }, []); // 空依赖数组，只在组件挂载时运行一次

  // 自动保存草稿（仅新建模式）
  useEffect(() => {
    if (isEditMode) {
      console.log('编辑模式：不保存草稿');
      return;
    }

    // 立即保存一次（当内容变化时）
    if (initialized && (slug || title || content)) {
      const draft = {
        slug,
        title,
        summary,
        selectedTags,
        content,
        savedAt: new Date().toISOString(),
      };
      localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
      console.log('✓ 草稿已保存:', { slug, title: title.substring(0, 20), contentLength: content.length });
    }
  }, [isEditMode, initialized, slug, title, summary, selectedTags, content]);

  // 清空草稿
  const clearDraft = () => {
    localStorage.removeItem(DRAFT_KEY);
    setSlug('');
    setTitle('');
    setSummary('');
    setSelectedTags([]);
    setContent('');
    setMessage({ type: 'success', text: '草稿已清空' });
    fetchNextId();
  };

  const toggleTag = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const previewContent = useMemo(() => content, [content]);

  const handleImportFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result;
      if (typeof text === 'string') {
        setContent(text);
        setMessage({ type: 'success', text: `✓ 已导入文件: ${file.name}` });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      }
    };
    reader.onerror = () => {
      setMessage({ type: 'error', text: '文件读取失败，请重试' });
    };
    reader.readAsText(file);
    // 重置 input 以允许重复导入同一文件
    e.target.value = '';
  };

  const handleUpload = async () => {
    if (!title.trim()) {
      setMessage({ type: 'error', text: '请输入标题' });
      return;
    }
    if (!hasContent) {
      setMessage({ type: 'error', text: '请编写正文内容' });
      return;
    }

    // 先显示标签选择弹窗
    setShowTagModal(true);
  };

  const confirmTags = () => {
    // 确认标签后显示密钥输入弹窗
    setShowTagModal(false);
    setShowKeyModal(true);
  };

  const addCustomTag = () => {
    const tag = customTag.trim();
    if (tag && !selectedTags.includes(tag)) {
      setSelectedTags((prev) => [...prev, tag]);
      setCustomTag('');
    }
  };

  const confirmUpload = async () => {
    const adminKey = tempKey.trim();
    if (!adminKey) {
      setMessage({ type: 'error', text: '请输入上传密钥' });
      return;
    }

    setShowKeyModal(false);
    setUploading(true);
    setMessage({ type: '', text: '' });

    try {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const date = `${year}-${month}-${day} ${hours}:${minutes}`;

      const finalSlug = slug || '00000000';

      const payload = {
        post: {
          slug: finalSlug,
          title: title.trim(),
          date: date, // 编辑模式下传递原时间，后端会更新为当前时间
          summary: summary.trim(),
          tags: selectedTags,
          type: 'md',
        },
        content,
        fileName: `${finalSlug}.md`,
      };

      const response = await fetch(
        isEditMode ? `${API_BASE_URL}/api/update` : `${API_BASE_URL}/api/upload`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${adminKey.trim()}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        const message = isEditMode ? '✓ 修改成功，文章已更新' : '✓ 上传成功，文章已发布';
        setMessage({ type: 'success', text: message });
        
        // 清除草稿和表单数据（新建模式）
        if (!isEditMode) {
          localStorage.removeItem(DRAFT_KEY);
          setSummary('');
          setSelectedTags([]);
          setContent('');
          setTempKey('');
          fetchNextId();
        }
        
        setTimeout(() => {
          window.location.href = `/posts/${finalSlug}`;
        }, 1000);
      } else {
        setMessage({ type: 'error', text: data.error || '上传失败，请重试' });
      }
    } catch (error) {
      console.error('上传失败:', error);
      setMessage({ type: 'error', text: `上传失败：${error.message}` });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
      <div className="flex-1 overflow-auto px-8 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 space-y-6 flex flex-col">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                在线编辑 Markdown
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                实时预览，输入密钥后直接发布到博客
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              {/* 导入文件按钮 */}
              <input
                ref={fileInputRef}
                type="file"
                accept=".md,.txt"
                onChange={handleImportFile}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
                title="导入 Markdown 文件"
                aria-label="导入文件"
              >
                <svg
                  className="w-6 h-6 text-purple-600 dark:text-purple-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
                  />
                </svg>
              </button>

              {/* 编辑器设置按钮 */}
              <button
                onClick={() => setShowSettingsModal(true)}
                className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
                title="编辑器设置"
                aria-label="编辑器设置"
              >
                <svg
                  className="w-6 h-6 text-gray-600 dark:text-gray-300"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              
              {/* 确认上传按钮 */}
              <button
                onClick={handleUpload}
                disabled={uploading}
                className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                title={uploading ? "上传中..." : "确认上传"}
                aria-label={uploading ? "上传中..." : "确认上传"}
              >
                {uploading ? (
                  <svg className="animate-spin w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <svg className="w-6 h-6 text-blue-600 dark:text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                  </svg>
                )}
              </button>
            </div>
          </div>

          {message.text && (
            <div
              className={`p-4 rounded-lg ${
                message.type === 'success'
                  ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                  : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
              }`}
            >
              {message.text}
            </div>
          )}

          <div className="space-y-4">
            {/* 标题和概述 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  标题 *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="文章标题"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  概述
                </label>
                <textarea
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  rows={1}
                  placeholder="文章摘要，可选"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>
            </div>

            {/* 编辑器和预览 */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500 dark:text-gray-500">
                  支持代码高亮、数学公式
                </span>
              </div>
              <div
                id="editor-container"
                className="flex gap-0 min-h-[840px] bg-white dark:bg-gray-800 rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600"
              >
                {/* 编辑框 */}
                <div
                  style={{ width: `${editorWidthPercent}%` }}
                  className="flex flex-col"
                >
                  <div className="flex h-full">
                    {/* 行号列 */}
                    <div className="bg-gray-100 dark:bg-gray-950 border-r border-gray-300 dark:border-gray-600 px-3 py-3 text-right select-none overflow-hidden">
                      <div
                        style={{ fontSize: `${fontSize}px` }}
                        className="font-mono text-gray-500 dark:text-gray-600 whitespace-pre"
                      >
                        {content.split('\n').map((_, i) => (i + 1).toString()).join('\n')}
                      </div>
                    </div>
                    {/* 代码区域 */}
                    <textarea
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Tab') {
                          e.preventDefault();
                          const { selectionStart, selectionEnd } = e.target;
                          const indent = ' '.repeat(tabSize);
                          const newValue =
                            content.substring(0, selectionStart) +
                            indent +
                            content.substring(selectionEnd);
                          setContent(newValue);
                          requestAnimationFrame(() => {
                            e.target.selectionStart = selectionStart + tabSize;
                            e.target.selectionEnd = selectionStart + tabSize;
                          });
                        }
                      }}
                      placeholder="在此书写 Markdown 内容..."
                      style={{ fontSize: `${fontSize}px` }}
                      className="flex-1 px-4 py-3 border-0 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-0 focus:outline-none font-mono resize-none"
                    />
                  </div>
                </div>

                {/* 分割线 */}
                <div
                  onMouseDown={() => setIsDragging(true)}
                  className="w-1 bg-gray-300 dark:bg-gray-600 hover:bg-blue-500 dark:hover:bg-blue-400 cursor-col-resize transition-colors select-none"
                />

                {/* 预览框 */}
                <div
                  style={{ width: `${100 - editorWidthPercent}%` }}
                  className="overflow-auto bg-gray-50 dark:bg-gray-900 p-4"
                >
                  {hasContent ? (
                    <PostContent content={previewContent} />
                  ) : (
                    <div className="h-full flex items-center justify-center text-gray-400 dark:text-gray-500 text-sm">
                      预览区域
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* 标签选择弹窗 */}
          {showTagModal && (
            <div
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
              onClick={() => setShowTagModal(false)}
            >
              <div
                className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-2xl mx-4 max-h-[80vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                  选择标签
                </h3>

                {/* 预设标签 */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    预设标签
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {TAG_OPTIONS.map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleTag(tag)}
                        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 ${
                          selectedTags.includes(tag)
                            ? 'bg-blue-600 hover:bg-blue-700 text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 自定义标签 */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    自定义标签
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={customTag}
                      onChange={(e) => setCustomTag(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && addCustomTag()}
                      placeholder="输入自定义标签"
                      className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      onClick={addCustomTag}
                      className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white transition-colors duration-200 font-medium"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* 已选择的标签 */}
                {selectedTags.length > 0 && (
                  <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      已选择 ({selectedTags.length})：
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {selectedTags.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 bg-blue-600 text-white rounded-full text-sm flex items-center gap-1"
                        >
                          {tag}
                          <button
                            onClick={() => toggleTag(tag)}
                            className="hover:bg-blue-700 rounded-full w-4 h-4 flex items-center justify-center transition-colors duration-200"
                            title="移除标签"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => {
                      setShowTagModal(false);
                      setCustomTag('');
                    }}
                    className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 transition-colors duration-200"
                  >
                    取消
                  </button>
                  <button
                    onClick={confirmTags}
                    className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white transition-colors font-medium"
                  >
                    下一步
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 密钥输入弹窗 */}
          {showKeyModal && (
            <div
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
              onClick={() => setShowKeyModal(false)}
            >
              <div
                className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md mx-4"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                  输入上传密钥
                </h3>
                <input
                  type="password"
                  value={tempKey}
                  onChange={(e) => setTempKey(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && confirmUpload()}
                  placeholder="请输入后端存储的密钥"
                  autoFocus
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"
                />
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => {
                      setShowKeyModal(false);
                      setTempKey('');
                    }}
                    className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 transition-colors duration-200"
                  >
                    取消
                  </button>
                  <button
                    onClick={confirmUpload}
                    className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white transition-colors font-medium"
                  >
                    确认上传
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 设置弹窗 */}
          {showSettingsModal && (
            <div
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
              onClick={() => setShowSettingsModal(false)}
            >
              <div
                className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md mx-4"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">
                  编辑器设置
                </h3>

                {/* 字体大小 */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    字体大小: <span className="text-blue-600 dark:text-blue-400">{fontSize}px</span>
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="24"
                    value={fontSize}
                    onChange={(e) => setFontSize(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">
                    <span>10px</span>
                    <span>24px</span>
                  </div>
                </div>

                {/* Tab 空格数 */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Tab 空格数
                  </label>
                  <div className="flex gap-2">
                    {[2, 4, 8].map((size) => (
                      <button
                        key={size}
                        onClick={() => setTabSize(size)}
                        className={`flex-1 px-3 py-2 rounded-lg font-medium transition-colors duration-200 ${
                          tabSize === size
                            ? 'bg-blue-600 hover:bg-blue-700 text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 关闭按钮 */}
                <div className="flex justify-end">
                  <button
                    onClick={() => setShowSettingsModal(false)}
                    className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white transition-colors font-medium"
                  >
                    完成
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
