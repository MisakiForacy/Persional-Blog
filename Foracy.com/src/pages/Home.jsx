// src/pages/Home.jsx
import Header from "../components/Header";
import BlogList from "../components/BlogList";
import Footer from "../components/Footer";

export default function Home() {
  return (
    // 关键：加上 max-w-2xl（或其他宽度）
    <div className="w-full mx-auto space-y-12 px-4">
      {/* <Header /> */}
      <BlogList />
    </div>
  );
}