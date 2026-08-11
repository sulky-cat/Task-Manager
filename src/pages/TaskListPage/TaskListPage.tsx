import { Plus } from 'lucide-react'
import { useTasks } from '@/hooks/useTasks'
import { useTaskFilters } from '@/hooks/useTaskFilters'
import { useTaskDialogs } from '@/hooks/useTaskDialogs'
import {
  Button,
  Modal,
  TaskForm,
  ConfirmDeleteDialog,
  TaskItem,
  TaskFilters,
  ErrorState,
} from '@/components'
import { formatTaskCount } from '@/utils/format'
import styles from './TaskListPage.module.css'

export function TaskListPage() {
  const { q, status, query, hasQuery, handleSearchChange, handleStatusChange } =
    useTaskFilters()
  const { data, isPending, isError, refetch } = useTasks(query, status)
  const { modal, deletingTask, openCreate, openEdit, closeModal, requestDelete, closeDelete } =
    useTaskDialogs()

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Список задач</h1>
            {data && <span className={styles.counter}>{formatTaskCount(data.length)}</span>}
          </div>
          <Button onClick={openCreate}>
            <Plus size={16} />
            Создать
          </Button>
        </div>

        <TaskFilters
          q={q}
          status={status}
          onSearchChange={handleSearchChange}
          onStatusChange={handleStatusChange}
        />

        {isPending ? (
          <p className="status">Загрузка…</p>
        ) : isError ? (
          <ErrorState
            message="Не удалось загрузить задачи. Проверьте, что сервер запущен."
            onRetry={refetch}
          />
        ) : data.length === 0 ? (
          <p className="status">{hasQuery ? 'Ничего не найдено' : 'Задач пока нет'}</p>
        ) : (
          <ul className={styles.list}>
            {data.map((task) => (
              <TaskItem key={task.id} task={task} onEdit={openEdit} onDelete={requestDelete} />
            ))}
          </ul>
        )}

        <Modal
          open={modal.open}
          title={modal.task ? 'Редактировать задачу' : 'Новая задача'}
          onClose={closeModal}
        >
          <TaskForm task={modal.task} onClose={closeModal} />
        </Modal>

        {deletingTask && <ConfirmDeleteDialog task={deletingTask} onClose={closeDelete} />}
      </div>
    </div>
  )
}
