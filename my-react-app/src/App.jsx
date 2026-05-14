import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import Portfolio from './pages/Portfolio'
import Chatbot from './components/Chatbot'

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/portfolio" element={<Portfolio />} />
        </Routes>
        <Chatbot />
      </div>
    </Router>
  )
}

export default App
