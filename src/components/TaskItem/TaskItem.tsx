import { Link } from 'react-router'
import { Pencil, Trash2 } from 'lucide-react'
import { useUpdateStatus } from '@/hooks/useUpdateStatus'
import { Badge, Button } from '@/components'
import {
  TASK_PRIORITY_META,
  TASK_STATUS_META,
  formatDate,
} from '@/utils/format'
import type { Task, TaskStatus } from '@/types/task'
import styles from './TaskItem.module.css'

interface TaskItemProps {
  task: Task
  onEdit: (task: Task) => void
  onDelete: (task: Task) => void
}

export function TaskItem({ task, onEdit, onDelete }: TaskItemProps) {
  const updateStatus = useUpdateStatus()
  const cardClass =
    task.status === 'done' ? `${styles.card} ${styles.done}` : styles.card

  return (
    <li className={cardClass}>
      <span
        className={styles.statusDot}
        style={{ background: TASK_STATUS_META[task.status].color }}
      />
      <div className={styles.content}>
        <h2 className={styles.titleWrap}>
          <Link to={`/tasks/${task.id}`} className={styles.title}>
            {task.title}
          </Link>
        </h2>
        <time className={styles.date} dateTime={task.createdAt}>
          Создана: {formatDate(task.createdAt)}
        </time>
      </div>
      <span className={styles.priority}>
        <Badge meta={TASK_PRIORITY_META[task.priority]} />
      </span>
      <div className={styles.controls}>
        <select
          className={styles.statusSelect}
          aria-label="Статус"
          value={task.status}
          onChange={(event) =>
            updateStatus.mutate({
              id: task.id,
              status: event.target.value as TaskStatus,
            })
          }
        >
          {Object.entries(TASK_STATUS_META).map(([value, meta]) => (
            <option key={value} value={value}>
              {meta.label}
            </option>
          ))}
        </select>
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
    </li>
  )
}
