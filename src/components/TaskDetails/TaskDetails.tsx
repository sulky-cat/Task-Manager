import { Pencil, Trash2 } from 'lucide-react'
import { Badge, Button } from '@/components'
import { TASK_PRIORITY_META, TASK_STATUS_META, formatDate } from '@/utils/format'
import type { Task } from '@/types/task'
import styles from './TaskDetails.module.css'

interface TaskDetailsProps {
  task: Task
  onEdit: (task: Task) => void
  onDelete: (task: Task) => void
}

export function TaskDetails({ task, onEdit, onDelete }: TaskDetailsProps) {
  return (
    <div className={styles.card}>
      <div className={styles.badges}>
        <Badge meta={TASK_STATUS_META[task.status]} />
        <Badge meta={TASK_PRIORITY_META[task.priority]} />
      </div>
      <h1 className={styles.title}>{task.title}</h1>
      {task.description && <p className={styles.description}>{task.description}</p>}
      <div className={styles.meta}>
        <div className={styles.metaItem}>
          <span className={styles.metaLabel}>Дата создания</span>
          <span className={styles.metaValue}>{formatDate(task.createdAt)}</span>
        </div>
        <div className={styles.metaItem}>
          <span className={styles.metaLabel}>ID</span>
          <span className={styles.metaValue}>{task.id}</span>
        </div>
      </div>
      <div className={styles.actions}>
        <Button
          variant="secondary"
          iconOnly
          aria-label="Редактировать"
          onClick={() => onEdit(task)}
        >
          <Pencil size={16} />
        </Button>
        <Button
          variant="danger"
          iconOnly
          aria-label="Удалить"
          onClick={() => onDelete(task)}
        >
          <Trash2 size={16} />
        </Button>
      </div>
    </div>
  )
}
