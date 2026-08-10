import { useState } from 'react'
import { useTasks } from './hooks/useTasks'
import { useUpdateStatus } from './hooks/useUpdateStatus'
import { useDeleteTask } from './hooks/useDeleteTask'
import { useDebouncedValue } from './hooks/useDebouncedValue'
import { TaskForm } from './components/TaskForm'
import {
  TASK_PRIORITY_META,
  TASK_STATUS_META,
  formatDate,
} from './utils/format'
import type { Task, TaskStatus } from './types/task'

export default function App() {
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebouncedValue(search, 300)
  const query = debouncedSearch.trim()
  const hasQuery = query.length > 0
  const { data, isPending, isError, refetch } = useTasks(query)
  const updateStatus = useUpdateStatus()
  const deleteTask = useDeleteTask()
  const [modal, setModal] = useState<{ open: boolean; task?: Task }>({
    open: false,
  })
  const [deletingTask, setDeletingTask] = useState<Task | null>(null)

  function openCreateModal() {
    setModal({ open: true })
  }

  function openEditModal(task: Task) {
    setModal({ open: true, task })
  }

  function closeModal() {
    setModal({ open: false })
  }

  function openDeleteDialog(task: Task) {
    deleteTask.reset()
    setDeletingTask(task)
  }

  return (
    <main>
      <div className="list-header">
        <h1>Список задач</h1>
        <button type="button" className="btn-primary" onClick={openCreateModal}>
          Создать
        </button>
      </div>

      <input
        type="search"
        className="search-input"
        placeholder="Поиск по названию"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />

      {isPending ? (
        <p className="status">Загрузка…</p>
      ) : isError ? (
        <div className="error-block">
          <p>Не удалось загрузить задачи. Проверьте, что сервер запущен.</p>
          <button type="button" onClick={() => refetch()}>
            Повторить
          </button>
        </div>
      ) : data.length === 0 ? (
        <p className="status">{hasQuery ? 'Ничего не найдено' : 'Задач пока нет'}</p>
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
                <button
                  type="button"
                  className="btn-danger"
                  onClick={() => openDeleteDialog(task)}
                >
                  Удалить
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

      {deletingTask && (
        <div className="modal-overlay" onClick={() => setDeletingTask(null)}>
          <div
            className="modal"
            role="dialog"
            aria-modal="true"
            onClick={(event) => event.stopPropagation()}
          >
            <h2>Удалить задачу?</h2>
            <p>Действие необратимо. Задача «{deletingTask.title}» будет удалена.</p>
            {deleteTask.isError && (
              <p className="error-block">{deleteTask.error?.message}</p>
            )}
            <div className="modal-actions">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setDeletingTask(null)}
              >
                Отмена
              </button>
              <button
                type="button"
                className="btn-danger"
                disabled={deleteTask.isPending}
                onClick={() =>
                  deleteTask.mutate(deletingTask.id, {
                    onSuccess: () => setDeletingTask(null),
                  })
                }
              >
                {deleteTask.isPending ? 'Удаление…' : 'Удалить'}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
