import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCreateTask } from '@/hooks/useCreateTask'
import { useUpdateTask } from '@/hooks/useUpdateTask'
import { TASK_PRIORITY_META, TASK_STATUS_META } from '@/utils/format'
import { taskFormSchema, type TaskFormValues } from '@/schemas/task'
import { Button } from '@/components/Button'
import type { Task } from '@/types/task'
import styles from './TaskForm.module.css'

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
  const titleInputClass = errors.title
    ? `${styles.input} ${styles.inputError}`
    : styles.input

  function onSubmit(values: TaskFormValues) {
    if (isEdit && task) {
      updateTask.mutate({ id: task.id, ...values }, { onSuccess: onClose })
    } else {
      createTask.mutate(values, { onSuccess: onClose })
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
      <label className={styles.field}>
        Название
        <input
          type="text"
          className={titleInputClass}
          {...register('title')}
          autoFocus
        />
        {errors.title && (
          <span className={styles.fieldError}>{errors.title.message}</span>
        )}
      </label>
      <label className={styles.field}>
        Описание
        <textarea
          className={`${styles.input} ${styles.textarea}`}
          rows={3}
          {...register('description')}
        />
      </label>
      <label className={styles.field}>
        Статус
        <select className={styles.input} {...register('status')}>
          {Object.entries(TASK_STATUS_META).map(([value, meta]) => (
            <option key={value} value={value}>
              {meta.label}
            </option>
          ))}
        </select>
      </label>
      <label className={styles.field}>
        Приоритет
        <select className={styles.input} {...register('priority')}>
          {Object.entries(TASK_PRIORITY_META).map(([value, meta]) => (
            <option key={value} value={value}>
              {meta.label}
            </option>
          ))}
        </select>
      </label>
      {isError && (
        <p className="error-block">
          Не удалось сохранить задачу. Проверьте, что сервер запущен.
        </p>
      )}
      <div className={styles.actions}>
        <Button variant="ghost" onClick={onClose}>
          Отмена
        </Button>
        <Button type="submit" disabled={isSubmitting || isPending}>
          {isPending ? 'Сохранение…' : isEdit ? 'Сохранить' : 'Создать'}
        </Button>
      </div>
    </form>
  )
}
