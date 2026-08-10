import { useDeleteTask } from '../hooks/useDeleteTask'
import { Modal } from './Modal'
import type { Task } from '../types/task'

interface ConfirmDeleteDialogProps {
  task: Task
  onClose: () => void
}

export function ConfirmDeleteDialog({ task, onClose }: ConfirmDeleteDialogProps) {
  const deleteTask = useDeleteTask()

  return (
    <Modal title="Удалить задачу?" onClose={onClose}>
      <p>Действие необратимо. Задача «{task.title}» будет удалена.</p>
      {deleteTask.isError && <p className="error-block">{deleteTask.error?.message}</p>}
      <div className="modal-actions">
        <button type="button" className="btn-secondary" onClick={onClose}>
          Отмена
        </button>
        <button
          type="button"
          className="btn-danger"
          disabled={deleteTask.isPending}
          onClick={() => deleteTask.mutate(task.id, { onSuccess: onClose })}
        >
          {deleteTask.isPending ? 'Удаление…' : 'Удалить'}
        </button>
      </div>
    </Modal>
  )
}
