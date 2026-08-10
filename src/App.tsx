import { useState, type SubmitEventHandler } from 'react'
import { useTasks } from './hooks/useTasks'
import { useCreateTask } from './hooks/useCreateTask'
import { useUpdateTask } from './hooks/useUpdateTask'
import {
  TASK_PRIORITY_META,
  TASK_STATUS_META,
  formatDate,
} from './utils/format'
import type { TaskPriority, TaskStatus } from './types/task'

export default function App() {
  const { data, isPending, isError, refetch } = useTasks()
  const createTask = useCreateTask()
  const updateTask = useUpdateTask()
  const [isModalOpen, setIsModalOpen] = useState(false)

  function openModal() {
    createTask.reset()
    setIsModalOpen(true)
  }

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    createTask.mutate(
      {
        title: String(formData.get('title')),
        description: String(formData.get('description') ?? ''),
        status: formData.get('status') as TaskStatus,
        priority: formData.get('priority') as TaskPriority,
      },
      {
        onSuccess: () => setIsModalOpen(false),
      },
    )
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
        <button type="button" className="btn-primary" onClick={openModal}>
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
                    updateTask.mutate({
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
            </li>
          ))}
        </ul>
      )}

      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div
            className="modal"
            role="dialog"
            aria-modal="true"
            onClick={(event) => event.stopPropagation()}
          >
            <h2 id="modal-title">Новая задача</h2>
            <form onSubmit={handleSubmit}>
              <label>
                Название
                <input type="text" name="title" required autoFocus />
              </label>
              <label>
                Описание
                <textarea name="description" rows={3} />
              </label>
              <label>
                Статус
                <select name="status" defaultValue="todo">
                  {Object.entries(TASK_STATUS_META).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Приоритет
                <select name="priority" defaultValue="medium">
                  {Object.entries(TASK_PRIORITY_META).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>
              {createTask.isError && (
                <p className="error-block">
                  Не удалось создать задачу. Проверьте, что сервер запущен.
                </p>
              )}
              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setIsModalOpen(false)}
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={createTask.isPending}
                >
                  {createTask.isPending ? 'Сохранение…' : 'Создать'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  )
}
