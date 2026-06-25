import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import TemplateList from './pages/TemplateList'
import TemplateDetail from './pages/TemplateDetail'
import ResumeBuilder from './pages/ResumeBuilder'
import UserCenter from './pages/UserCenter'
import ProPage from './pages/ProPage'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/templates" element={<TemplateList />} />
            <Route path="/template/:id" element={<TemplateDetail />} />
            <Route path="/builder/:templateId?" element={<ResumeBuilder />} />
            <Route path="/user" element={<UserCenter />} />
            <Route path="/pro" element={<ProPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App
