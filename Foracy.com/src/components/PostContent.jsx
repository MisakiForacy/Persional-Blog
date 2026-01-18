import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

export default function PostContent({ content }) {
    return (
        <article className="prose dark:prose-invert max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {content}
            </ReactMarkdown>
        </article>
    )
}