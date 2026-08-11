import type { TaskPriority, TaskStatus } from '@/types/task'

export interface TaskMeta {
  label: string
  color: string
  background: string
}

export const TASK_STATUS_META: Record<TaskStatus, TaskMeta> = {
  todo: {
    label: 'К выполнению',
    color: 'var(--color-status-todo)',
    background: 'var(--color-status-todo-bg)',
  },
  in_progress: {
    label: 'В работе',
    color: 'var(--color-status-in-progress)',
    background: 'var(--color-status-in-progress-bg)',
  },
  done: {
    label: 'Готово',
    color: 'var(--color-status-done)',
    background: 'var(--color-status-done-bg)',
  },
}

export const TASK_PRIORITY_META: Record<TaskPriority, TaskMeta> = {
  low: {
    label: 'Низкий',
    color: 'var(--color-priority-low)',
    background: 'var(--color-priority-low-bg)',
  },
  medium: {
    label: 'Средний',
    color: 'var(--color-priority-medium)',
    background: 'var(--color-priority-medium-bg)',
  },
  high: {
    label: 'Высокий',
    color: 'var(--color-priority-high)',
    background: 'var(--color-priority-high-bg)',
  },
}

const dateFormatter = new Intl.DateTimeFormat('ru-RU', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})

export function formatDate(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return '—'
  return dateFormatter.format(date)
}

export function formatTaskCount(count: number): string {
  const mod10 = count % 10
  const mod100 = count % 100
  if (mod10 === 1 && mod100 !== 11) return `${count} задача`
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) {
    return `${count} задачи`
  }
  return `${count} задач`
}
