import { Routes, Route } from 'react-router'
import { TaskListPage, TaskDetailPage, NotFoundPage } from '@/pages'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<TaskListPage />} />
      <Route path="/tasks/:id" element={<TaskDetailPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
