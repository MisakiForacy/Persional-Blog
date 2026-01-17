import { posts } from "../posts/meta"

export default function BlogList() {
    return (
        <main className="space-y-8">
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300">
                最近文章
            </h2>
            {posts.map(post => (
                <article key={post.slug} className="pb-6 border-b border-gray-200 dark:border-gray-700">
                    <a href={`posts/${post.slug}`} className="block group">
                        <h3 className="text-xl font-medium group-hover:underline">
                            {post.title}
                        </h3>
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                            <time>{post.data}</time>
                            <span className="mx-2">.</span>
                            <span>{post.summary}</span>
                        </div>
                    </a>
                </article>
            ))}
        </main>
    );
}