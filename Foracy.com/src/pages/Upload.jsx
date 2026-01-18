import MarkdownUploader from '../components/MarkdownUploader';

export default function Upload() {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">上传 Markdown 并预览</h2>
      <MarkdownUploader />
    </div>
  );
}