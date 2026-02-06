import { Routes, Route } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import { HomePage } from './pages/HomePage'
import { ProjectsPage } from './pages/ProjectsPage'
import { ConsultingPage } from './pages/ConsultingPage'
import { BlogListPage } from './pages/BlogListPage'
import { BlogPostPage } from './pages/BlogPostPage'
import { BooksPage } from './pages/BooksPage'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/consulting" element={<ConsultingPage />} />
        <Route path="/blog" element={<BlogListPage />} />
        <Route path="/blog/:slug" element={<BlogPostPage />} />
        <Route path="/books" element={<BooksPage />} />
      </Route>
    </Routes>
  )
}

export default App
