import { useState } from 'react'
import { useTasks } from './hooks/useTasks'
import { useUpdateStatus } from './hooks/useUpdateStatus'
import { TaskForm } from './components/TaskForm'
import {
  TASK_PRIORITY_META,
  TASK_STATUS_META,
  formatDate,
} from './utils/format'
import type { Task, TaskStatus } from './types/task'

export default function App() {
  const { data, isPending, isError, refetch } = useTasks()
  const updateStatus = useUpdateStatus()
  const [modal, setModal] = useState<{ open: boolean; task?: Task }>({
    open: false,
  })

  function openCreateModal() {
    setModal({ open: true })
  }

  function openEditModal(task: Task) {
    setModal({ open: true, task })
  }

  function closeModal() {
    setModal({ open: false })
  }

  if (isPending) {
    return <p className="status">Загрузка…</p>
  }

  if (isError) {
    return (
      <main>
        <h1>Список задач</h1>
        <div className="error-block">
          <p>Не удалось загрузить задачи. Проверьте, что сервер запущен.</p>
          <button type="button" onClick={() => refetch()}>
            Повторить
          </button>
        </div>
      </main>
    )
  }

  return (
    <main>
      <div className="list-header">
        <h1>Список задач</h1>
        <button type="button" className="btn-primary" onClick={openCreateModal}>
          Создать
        </button>
      </div>

      {data.length === 0 ? (
        <p className="status">Задач пока нет</p>
      ) : (
        <ul className="task-list">
          {data.map((task) => (
            <li key={task.id}>
              <h2>{task.title}</h2>
              <label className="status-select">
                Статус
                <select
                  value={task.status}
                  onChange={(event) =>
                    updateStatus.mutate({
                      id: task.id,
                      status: event.target.value as TaskStatus,
                    })
                  }
                >
                  {Object.entries(TASK_STATUS_META).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>
              <p>Приоритет: {TASK_PRIORITY_META[task.priority]}</p>
              <time dateTime={task.createdAt}>
                Создана: {formatDate(task.createdAt)}
              </time>
              <div className="task-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => openEditModal(task)}
                >
                  Редактировать
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {modal.open && (
        <div className="modal-overlay" onClick={closeModal}>
          <div
            className="modal"
            role="dialog"
            aria-modal="true"
            onClick={(event) => event.stopPropagation()}
          >
            <h2>{modal.task ? 'Редактировать задачу' : 'Новая задача'}</h2>
            <TaskForm task={modal.task} onClose={closeModal} />
          </div>
        </div>
      )}
    </main>
  )
}
