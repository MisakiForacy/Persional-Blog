// src/pages/PostPage.jsx
import { useParams } from 'react-router-dom';
import { posts } from '../posts/meta'; // ← 你的文章元数据
import { useEffect, useState } from 'react';

export default function PostPage() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [content, setContent] = useState('');

  useEffect(() => {
    // 1. 找到匹配的文章元数据
    const found = posts.find(p => p.slug === slug);
    if (!found) {
      setPost(null);
      return;
    }
    setPost(found);

    // 2. 动态导入对应的 Markdown 文件（需 Vite 支持）
    import(`../posts/${slug}.md?raw`)
      .then(mod => setContent(mod.default))
      .catch(err => {
        console.error('Failed to load post:', err);
        setContent('# 文章未找到\n\n抱歉，该文章不存在。');
      });
  }, [slug]);

  if (!post) {
    return <div className="text-center py-12">文章不存在</div>;
  }

  return (
    <article className="prose prose-gray dark:prose-invert max-w-none">
      <h1>{post.title}</h1>
      <time className="text-gray-500 dark:text-gray-400 block mb-6">
        {post.date}
      </time>
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </article>
  );
}