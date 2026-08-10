import { useTasks } from './hooks/useTasks'
import { TASK_STATUS_META, formatDate } from './utils/format'

export default function App() {
  const { data, isPending, isError, refetch } = useTasks()

  if (isPending) {
    return <p className="status">Загрузка…</p>
  }

  if (isError) {
    return (
      <main>
        <h1>Список задач</h1>
        <div className="error-block">
          <p>Не удалось загрузить задачи. Проверьте, что сервер запущен.</p>
          <button type="button" onClick={() => refetch()}>
            Повторить
          </button>
        </div>
      </main>
    )
  }

  return (
    <main>
      <h1>Список задач</h1>
      {data.length === 0 ? (
        <p className="status">Задач пока нет</p>
      ) : (
        <ul className="task-list">
          {data.map((task) => (
            <li key={task.id}>
              <h2>{task.title}</h2>
              <p>Статус: {TASK_STATUS_META[task.status]}</p>
              <time dateTime={task.createdAt}>
                Создана: {formatDate(task.createdAt)}
              </time>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
