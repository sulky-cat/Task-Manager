import { type FormEvent } from 'react'
import { useCreateTask } from '../hooks/useCreateTask'
import { useUpdateTask } from '../hooks/useUpdateTask'
import { TASK_PRIORITY_META, TASK_STATUS_META } from '../utils/format'
import type { NewTask, Task, TaskPriority, TaskStatus } from '../types/task'

interface TaskFormProps {
  task?: Task
  onClose: () => void
}

export function TaskForm({ task, onClose }: TaskFormProps) {
  const createTask = useCreateTask()
  const updateTask = useUpdateTask()
  const isEdit = task !== undefined
  const isPending = isEdit ? updateTask.isPending : createTask.isPending
  const isError = isEdit ? updateTask.isError : createTask.isError

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const values: NewTask = {
      title: String(formData.get('title')),
      description: String(formData.get('description') ?? ''),
      status: formData.get('status') as TaskStatus,
      priority: formData.get('priority') as TaskPriority,
    }
    if (isEdit && task) {
      updateTask.mutate({ id: task.id, ...values }, { onSuccess: onClose })
    } else {
      createTask.mutate(values, { onSuccess: onClose })
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Название
        <input type="text" name="title" required autoFocus defaultValue={task?.title} />
      </label>
      <label>
        Описание
        <textarea name="description" rows={3} defaultValue={task?.description} />
      </label>
      <label>
        Статус
        <select name="status" defaultValue={task?.status ?? 'todo'}>
          {Object.entries(TASK_STATUS_META).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </label>
      <label>
        Приоритет
        <select name="priority" defaultValue={task?.priority ?? 'medium'}>
          {Object.entries(TASK_PRIORITY_META).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </label>
      {isError && (
        <p className="error-block">
          Не удалось сохранить задачу. Проверьте, что сервер запущен.
        </p>
      )}
      <div className="modal-actions">
        <button type="button" className="btn-secondary" onClick={onClose}>
          Отмена
        </button>
        <button type="submit" className="btn-primary" disabled={isPending}>
          {isPending ? 'Сохранение…' : isEdit ? 'Сохранить' : 'Создать'}
        </button>
      </div>
    </form>
  )
}
