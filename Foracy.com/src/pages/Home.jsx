import Header from "../components/Header";
import BlogList from "../components/BlogList.jsx";
import Footer from "../components/Footer.jsx";

export default function Home() {
    return (
        <div className="space-y-12">
            <Header />
            <div className="space-y-12">
                <BlogList />
            </div>
            <Footer />
        </div>
    );
}