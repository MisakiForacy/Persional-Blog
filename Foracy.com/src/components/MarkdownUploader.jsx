import { useState } from 'react';
import PostContent from './PostContent';

export default function MarkdownUploader() {
  const [content, setContent] = useState('');
  const [fileName, setFileName] = useState('');

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    const text = await file.text();
    setContent(text);
  };

  return (
    <div className="space-y-4">
      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="file"
          accept=".md,.markdown,text/markdown"
          className="hidden"
          onChange={handleFile}
        />
        <span className="px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition">
          选择本地 Markdown 文件
        </span>
        {fileName && <span className="text-sm text-gray-500 dark:text-gray-400">{fileName}</span>}
      </label>

      {content ? (
        <PostContent content={content} />
      ) : (
        <p className="text-gray-500 dark:text-gray-400 text-sm">尚未选择文件</p>
      )}
    </div>
  );
}