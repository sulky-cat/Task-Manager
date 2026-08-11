import { Link } from 'react-router'
import { ArrowLeft } from 'lucide-react'

export function NotFoundPage() {
  return (
    <main>
      <h1>Страница не найдена</h1>
      <p>По этому адресу ничего нет.</p>
      <Link to="/" className="back-link">
        <ArrowLeft size={16} />
        Назад к списку задач
      </Link>
    </main>
  )
}
