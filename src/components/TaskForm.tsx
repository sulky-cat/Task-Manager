import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCreateTask } from '../hooks/useCreateTask'
import { useUpdateTask } from '../hooks/useUpdateTask'
import { TASK_PRIORITY_META, TASK_STATUS_META } from '../utils/format'
import { taskFormSchema, type TaskFormValues } from '../schemas/task'
import type { Task } from '../types/task'

interface TaskFormProps {
  task?: Task
  onClose: () => void
}

export function TaskForm({ task, onClose }: TaskFormProps) {
  const createTask = useCreateTask()
  const updateTask = useUpdateTask()
  const isEdit = task !== undefined

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: task
      ? {
          title: task.title,
          description: task.description,
          status: task.status,
          priority: task.priority,
        }
      : {
          title: '',
          description: '',
          status: 'todo',
          priority: 'medium',
        },
  })

  const isPending = isEdit ? updateTask.isPending : createTask.isPending
  const isError = isEdit ? updateTask.isError : createTask.isError

  function onSubmit(values: TaskFormValues) {
    if (isEdit && task) {
      updateTask.mutate({ id: task.id, ...values }, { onSuccess: onClose })
    } else {
      createTask.mutate(values, { onSuccess: onClose })
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <label>
        Название
        <input type="text" {...register('title')} autoFocus />
        {errors.title && <span className="field-error">{errors.title.message}</span>}
      </label>
      <label>
        Описание
        <textarea rows={3} {...register('description')} />
      </label>
      <label>
        Статус
        <select {...register('status')}>
          {Object.entries(TASK_STATUS_META).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </label>
      <label>
        Приоритет
        <select {...register('priority')}>
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
        <button
          type="submit"
          className="btn-primary"
          disabled={isSubmitting || isPending}
        >
          {isPending ? 'Сохранение…' : isEdit ? 'Сохранить' : 'Создать'}
        </button>
      </div>
    </form>
  )
}
