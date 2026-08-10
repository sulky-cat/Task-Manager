import { useEffect, useState } from 'react'
import type { Task } from './types/task'
import { TASK_STATUS_META, formatDate } from './utils/format'

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isPending, setIsPending] = useState(true)

  useEffect(() => {
    fetch('/api/tasks')
      .then((response) => response.json())
      .then((data: Task[]) => {
        setTasks(data)
      })
      .finally(() => {
        setIsPending(false)
      })
  }, [])

  if (isPending) {
    return <p className="status">Загрузка…</p>
  }

  return (
    <main>
      <h1>Список задач</h1>
      <ul className="task-list">
        {tasks.map((task) => (
          <li key={task.id}>
            <h2>{task.title}</h2>
            <p>Статус: {TASK_STATUS_META[task.status]}</p>
            <time dateTime={task.createdAt}>
              Создана: {formatDate(task.createdAt)}
            </time>
          </li>
        ))}
      </ul>
    </main>
  )
}
