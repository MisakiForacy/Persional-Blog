import { useState } from 'react';
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
  const [message, setMessage] = useState({ type: '', text: '' });

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

    // 如果slug为空，自动从文件名生成
    if (!slug) {
      const suggestedSlug = file.name.replace(/\.(md|markdown|html|htm)$/i, '');
      setSlug(suggestedSlug);
    }
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
    if (!slug.trim()) {
      setMessage({ type: 'error', text: '请输入 Slug' });
      return;
    }
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
      // 获取当前日期 YYYY-MM-DD
      const today = new Date();
      const date = today.toISOString().split('T')[0];

      // 构建新文章对象
      const newPost = {
        slug: slug.trim(),
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
          fileName: `${slug}.${fileType}`
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setMessage({ type: 'success', text: '✓ 上传成功！文章已发布。' });
        // 清空表单
        setTimeout(() => {
          setSlug('');
          setTitle('');
          setSummary('');
          setSelectedTags([]);
          setContent('');
          setFileName('');
          setFileType('');
          setMessage({ type: '', text: '' });
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

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
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
          {/* Slug 输入 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Slug <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="例如：hello-world（URL 中使用）"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
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
      </div>
    </div>
  );
}