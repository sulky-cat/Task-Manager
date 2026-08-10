import { useState } from 'react'
import { Link, useParams } from 'react-router'
import { TaskNotFoundError, useTask } from '../hooks/useTask'
import { TaskForm } from '../components/TaskForm'
import { Modal } from '../components/Modal'
import { ConfirmDeleteDialog } from '../components/ConfirmDeleteDialog'
import {
  TASK_PRIORITY_META,
  TASK_STATUS_META,
  formatDate,
} from '../utils/format'
import type { Task } from '../types/task'

export function TaskDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data, isPending, isError, error, refetch } = useTask(id!)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [deletingTask, setDeletingTask] = useState<Task | null>(null)
  const isNotFound = error instanceof TaskNotFoundError

  return (
    <main>
      <Link to="/" className="back-link">
        ← Назад к списку
      </Link>

      {isPending ? (
        <p className="status">Загрузка…</p>
      ) : isError ? (
        <div className="error-block">
          <p>
            {isNotFound
              ? error.message
              : 'Не удалось загрузить задачу. Проверьте, что сервер запущен.'}
          </p>
          {!isNotFound && (
            <button type="button" onClick={() => refetch()}>
              Повторить
            </button>
          )}
        </div>
      ) : (
        <>
          <h1>{data.title}</h1>
          {data.description && (
            <p className="task-description">{data.description}</p>
          )}
          <p>Статус: {TASK_STATUS_META[data.status]}</p>
          <p>Приоритет: {TASK_PRIORITY_META[data.priority]}</p>
          <time dateTime={data.createdAt}>
            Создана: {formatDate(data.createdAt)}
          </time>
          <div className="task-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={() => setIsEditOpen(true)}
            >
              Редактировать
            </button>
            <button
              type="button"
              className="btn-danger"
              onClick={() => setDeletingTask(data)}
            >
              Удалить
            </button>
          </div>
        </>
      )}

      {isEditOpen && (
        <Modal
          title="Редактировать задачу"
          onClose={() => setIsEditOpen(false)}
        >
          <TaskForm task={data} onClose={() => setIsEditOpen(false)} />
        </Modal>
      )}

      {deletingTask && (
        <ConfirmDeleteDialog
          task={deletingTask}
          onClose={() => setDeletingTask(null)}
        />
      )}
    </main>
  )
}
