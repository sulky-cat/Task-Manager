import { Link, useParams } from 'react-router'
import { ArrowLeft } from 'lucide-react'
import { TaskNotFoundError, useTask } from '@/hooks/useTask'
import { useTaskDialogs } from '@/hooks/useTaskDialogs'
import { Modal, TaskForm, ConfirmDeleteDialog, TaskDetails, ErrorState } from '@/components'
import styles from './TaskDetailPage.module.css'

export function TaskDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data, isPending, isError, error, refetch } = useTask(id!)
  const { modal, deletingTask, openEdit, closeModal, requestDelete, closeDelete } =
    useTaskDialogs()
  const isNotFound = error instanceof TaskNotFoundError

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <Link to="/" className="back-link">
          <ArrowLeft size={16} />
          Назад к списку
        </Link>

        {isPending ? (
          <p className="status">Загрузка…</p>
        ) : isError ? (
          <ErrorState
            message={
              isNotFound
                ? error.message
                : 'Не удалось загрузить задачу. Проверьте, что сервер запущен.'
            }
            onRetry={isNotFound ? undefined : refetch}
          />
        ) : (
          <TaskDetails task={data} onEdit={openEdit} onDelete={requestDelete} />
        )}

        <Modal open={modal.open} title="Редактировать задачу" onClose={closeModal}>
          <TaskForm task={modal.task} onClose={closeModal} />
        </Modal>

        {deletingTask && <ConfirmDeleteDialog task={deletingTask} onClose={closeDelete} />}
      </div>
    </div>
  )
}
