import { Routes, Route } from 'react-router'
import { TaskListPage } from './pages/TaskListPage'
import { TaskDetailPage } from './pages/TaskDetailPage'
import { NotFoundPage } from './pages/NotFoundPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<TaskListPage />} />
      <Route path="/tasks/:id" element={<TaskDetailPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
