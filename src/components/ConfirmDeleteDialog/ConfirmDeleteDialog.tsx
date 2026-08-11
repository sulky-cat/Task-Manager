import { Trash2 } from 'lucide-react'
import { useDeleteTask } from '@/hooks/useDeleteTask'
import { Button } from '@/components/Button'
import { Modal } from '@/components/Modal'
import type { Task } from '@/types/task'
import styles from './ConfirmDeleteDialog.module.css'

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
      <div className={styles.actions}>
        <Button variant="ghost" onClick={onClose}>
          Отмена
        </Button>
        <Button
          variant="danger"
          disabled={deleteTask.isPending}
          onClick={() => deleteTask.mutate(task.id, { onSuccess: onClose })}
        >
          <Trash2 size={16} />
          {deleteTask.isPending ? 'Удаление…' : 'Удалить'}
        </Button>
      </div>
    </Modal>
  )
}
