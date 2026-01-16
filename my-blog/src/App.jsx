import { useState } from 'react'
import Home from './pages/Home.jsx';
import './App.css'

function App() {
  // const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100">
      <Home />
    </div>
  );
}

export default App;