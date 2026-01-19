import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeRaw from 'rehype-raw';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css';
import { useState } from 'react';

function CodeBlock({ node, inline, className, children, ...props }) {
  const [copied, setCopied] = useState(false);
  const match = /language-(\w+)/.exec(className || '');
  const lang = match ? match[1] : '';
  const code = String(children).replace(/\n$/, '');

  const getHighlighted = () => {
    try {
      if (lang) {
        // 先检查语言是否被支持
        const supportedLangs = hljs.listLanguages();
        if (supportedLangs.includes(lang)) {
          return hljs.highlight(code, { language: lang, ignoreIllegals: true })
            .value;
        } else {
          console.warn(`不支持的语言 "${lang}"，使用自动检测`);
          return hljs.highlightAuto(code).value;
        }
      }
      return hljs.highlightAuto(code).value;
    } catch (err) {
      console.warn('代码高亮失败，使用纯文本回退:', err);
      return code
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
    }
  };

  // 行内代码：简单样式，无复制按钮
  if (inline || !className) {
    return (
      <code
        className="bg-gray-100 dark:bg-gray-800 text-red-600 dark:text-red-400 px-1.5 py-0.5 rounded text-sm font-mono"
        {...props}
      >
        {children}
      </code>
    );
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.warn('复制代码失败:', err);
    }
  };
  const highlightedCode = getHighlighted();

  // 代码块：高亮 + 复制按钮
  return (
    <div className="relative group my-4 not-prose">
      <pre className="bg-gray-100 dark:bg-gray-700 !text-gray-900 dark:!text-gray-100 !p-4 !rounded-lg !overflow-x-auto !m-0">
        <code
          className={className}
          dangerouslySetInnerHTML={{ __html: highlightedCode }}
        />
      </pre>
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 px-3 py-1 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 text-gray-900 dark:text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity"
        aria-label="复制代码"
      >
        {copied ? '✓ 已复制' : '复制'}
      </button>
    </div>
  );
}

export default function PostContent({ content }) {
  return (
    <article className="max-w-none text-gray-900 dark:text-gray-100 leading-relaxed">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeRaw, rehypeKatex]}
        components={{
          code: CodeBlock,
          h1: ({ node, ...props }) => (
            <h1 className="text-3xl font-bold mt-6 mb-4" {...props} />
          ),
          h2: ({ node, ...props }) => (
            <h2 className="text-2xl font-bold mt-5 mb-3" {...props} />
          ),
          h3: ({ node, ...props }) => (
            <h3 className="text-xl font-bold mt-4 mb-2" {...props} />
          ),
          p: ({ node, ...props }) => <p className="mb-4" {...props} />,
          ul: ({ node, ...props }) => (
            <ul className="list-disc list-inside mb-4 space-y-1" {...props} />
          ),
          ol: ({ node, ...props }) => (
            <ol
              className="list-decimal list-inside mb-4 space-y-1"
              {...props}
            />
          ),
          blockquote: ({ node, ...props }) => (
            <blockquote
              className="border-l-4 border-gray-300 dark:border-gray-600 pl-4 italic my-4"
              {...props}
            />
          ),
          table: ({ node, ...props }) => (
            <table
              className="table-auto w-full border-collapse my-4 text-left"
              {...props}
            />
          ),
          thead: ({ node, ...props }) => (
            <thead className="bg-gray-100 dark:bg-gray-800" {...props} />
          ),
          tbody: ({ node, ...props }) => <tbody {...props} />,
          tr: ({ node, ...props }) => (
            <tr className="border-b border-gray-200 dark:border-gray-700" {...props} />
          ),
          th: ({ node, ...props }) => (
            <th
              className="px-3 py-2 border border-gray-200 dark:border-gray-700 text-sm font-semibold text-gray-900 dark:text-gray-100"
              {...props}
            />
          ),
          td: ({ node, ...props }) => (
            <td
              className="px-3 py-2 border border-gray-200 dark:border-gray-700 text-sm text-gray-800 dark:text-gray-200"
              {...props}
            />
          ),
          a: ({ node, ...props }) => (
            <a
              className="text-blue-600 dark:text-blue-400 hover:underline"
              {...props}
            />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </article>
  );
}
