// src/App.jsx
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import PostPage from './pages/PostPage'; 
import Header from './components/Header';
import Footer from './components/Footer';

export default function App() {
  return (
    <div 
      className="flex flex-col 
                min-h-screen bg-white-100 
                dark:bg-gray-900 text-gray-900 
                dark:text-gray-100"
    >
      <header>
        <div className="max-w-2xl mx-auto px-4 py-6 w-full">
          <Header />
        </div>
      </header>
      <main className="flex-grow">
        <div className="max-w-2xl mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/posts/:slug" element={<PostPage />} />
          </Routes>
        </div>
      </main>

      <footer className="shrink-0">
        <div className="max-w-2xl mx-auto px-4 py-6 w-full">
          <Footer />
        </div>
      </footer>
    </div>
  );
}