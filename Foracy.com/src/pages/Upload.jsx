import { useState, useEffect } from 'react';
import PostContent from '../components/PostContent';

const TAG_OPTIONS = [
  '算法', '前端', '后端', '数据结构', '竞赛', 
  'React', 'Vue', 'Node.js', 'Python', 'Java',
  '人工智能', '机器学习', '数据库', '系统设计', '其他'
];

// API 服务器地址（开发环境）
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export default function Upload() {
  const [slug, setSlug] = useState('');
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [content, setContent] = useState('');
  const [fileName, setFileName] = useState('');
  const [fileType, setFileType] = useState(''); // 'md' or 'html'
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteSlug, setDeleteSlug] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });

  // 组件加载时获取下一个ID
  useEffect(() => {
    const fetchNextId = async () => {
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
      }
    };
    fetchNextId();
  }, []);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const fileExtension = file.name.split('.').pop().toLowerCase();
    if (!['md', 'markdown', 'html', 'htm'].includes(fileExtension)) {
      setMessage({ type: 'error', text: '仅支持 .md 和 .html 文件' });
      return;
    }

    setFileName(file.name);
    setFileType(fileExtension === 'html' || fileExtension === 'htm' ? 'html' : 'md');
    const text = await file.text();
    setContent(text);
    setMessage({ type: '', text: '' });

    // 文件名不再影响slug，slug由后端统一分配
  };

  const toggleTag = (tag) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleConfirm = async () => {
    // 验证必填字段
    if (!title.trim()) {
      setMessage({ type: 'error', text: '请输入标题' });
      return;
    }
    if (!content) {
      setMessage({ type: 'error', text: '请选择文件' });
      return;
    }

    setUploading(true);
    setMessage({ type: '', text: '' });

    try {
      // 获取当前日期时间 YYYY-MM-DD HH:mm
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      const hours = String(today.getHours()).padStart(2, '0');
      const minutes = String(today.getMinutes()).padStart(2, '0');
      const date = `${year}-${month}-${day} ${hours}:${minutes}`;

      // 使用当前slug（由后端分配的6位ID）
      const finalSlug = slug.trim();

      // 构建新文章对象
      const newPost = {
        slug: finalSlug,
        title: title.trim(),
        date: date,
        summary: summary.trim() || '',
        tags: selectedTags,
        type: fileType
      };

      // 调用后端API
      const response = await fetch(`${API_BASE_URL}/api/upload`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          post: newPost,
          content: content,
          fileName: `${finalSlug}.${fileType}`
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setMessage({ type: 'success', text: '✓ 上传成功！文章已发布。' });
        // 清空表单并获取新ID
        setTimeout(async () => {
          setTitle('');
          setSummary('');
          setSelectedTags([]);
          setContent('');
          setFileName('');
          setFileType('');
          setMessage({ type: '', text: '' });
          
          // 重新获取下一个ID
          try {
            const nextIdResponse = await fetch(`${API_BASE_URL}/api/next-id`);
            if (nextIdResponse.ok) {
              const nextIdData = await nextIdResponse.json();
              if (nextIdData.success && nextIdData.nextId) {
                setSlug(nextIdData.nextId);
              }
            }
          } catch (err) {
            console.error('获取新ID失败:', err);
          }
        }, 2000);
      } else {
        setMessage({ type: 'error', text: data.error || '上传失败，请重试' });
      }
    } catch (error) {
      console.error('Upload error:', error);
      setMessage({ 
        type: 'error', 
        text: `连接失败：${error.message}。请确保后端服务器正在运行（http://localhost:3001）` 
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteSlug.trim()) {
      setMessage({ type: 'error', text: '请输入要删除的 Slug' });
      return;
    }

    setDeleting(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await fetch(`${API_BASE_URL}/api/posts/${deleteSlug.trim()}`, {
        method: 'DELETE'
      });
      const data = await response.json();

      if (response.ok && data.success) {
        setMessage({ type: 'success', text: `✓ 已删除文章：${deleteSlug.trim()}` });
        setDeleteSlug('');
      } else {
        setMessage({ type: 'error', text: data.error || '删除失败，请重试' });
      }
    } catch (error) {
      console.error('Delete error:', error);
      setMessage({ 
        type: 'error', 
        text: `删除失败：${error.message}。请确认后端已启动（http://localhost:3001）` 
      });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 space-y-6">
        {/* 标题栏 */}
        <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">上传文章</h2>
          <button
            onClick={handleConfirm}
            disabled={uploading}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              uploading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {uploading ? '上传中...' : '确认上传'}
          </button>
        </div>

        {/* 消息提示 */}
        {message.text && (
          <div className={`p-4 rounded-lg ${
            message.type === 'success' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' :
            message.type === 'error' ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200' :
            'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
          }`}>
            {message.text}
          </div>
        )}

        {/* 表单区域 */}
        <div className="space-y-4">
          {/* ID 显示（只读） */}
          <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg border border-gray-200 dark:border-gray-600">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">文章ID</span>
              <span className="text-lg font-mono font-semibold text-blue-600 dark:text-blue-400">{slug || '加载中...'}</span>
            </div>
          </div>

          {/* 标题输入 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              标题 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="文章标题"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* 概述输入 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              概述
            </label>
            <textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="文章简介或摘要"
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* 标签选择 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              标签
            </label>
            <div className="flex flex-wrap gap-2">
              {TAG_OPTIONS.map(tag => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    selectedTags.includes(tag)
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
            {selectedTags.length > 0 && (
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                已选择：{selectedTags.join('、')}
              </p>
            )}
          </div>

          {/* 文件上传 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              选择本地文件（支持 .md 和 .html）<span className="text-red-500">*</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="file"
                accept=".md,.markdown,.html,.htm"
                className="hidden"
                onChange={handleFile}
              />
              <span className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 transition">
                {fileName ? '重新选择文件' : '选择文件'}
              </span>
              {fileName && (
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {fileName} ({fileType.toUpperCase()})
                </span>
              )}
            </label>
          </div>
        </div>

        {/* 预览区域 */}
        {content && (
          <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">预览</h3>
            {fileType === 'md' ? (
              <PostContent content={content} />
            ) : (
              <div 
                className="prose dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: content }} 
              />
            )}
          </div>
        )}

        {!content && (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            请填写文章信息并选择文件
          </div>
        )}

        {/* 删除文章 */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">删除文章</h3>
          <div className="flex flex-col md:flex-row md:items-center gap-3">
            <input
              type="text"
              value={deleteSlug}
              onChange={(e) => setDeleteSlug(e.target.value)}
              placeholder="输入要删除的文章 Slug"
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
            <button
              onClick={handleDelete}
              disabled={deleting}
              className={`px-5 py-2 rounded-lg font-medium transition-colors ${
                deleting
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-red-600 hover:bg-red-700 text-white'
              }`}
            >
              {deleting ? '删除中...' : '删除文章'}
            </button>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">删除将移除对应文件并更新 meta.js，请谨慎操作。</p>
        </div>
      </div>
    </div>
  );
}