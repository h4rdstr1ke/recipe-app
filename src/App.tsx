import { useState } from 'react'
import './index.css'
import Header from './components/header/Header'
import Home from './pages/Home';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  return (
    <>
      <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <Home searchQuery={searchQuery} />
    </>
  )
}

export default App
