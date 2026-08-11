import { Search } from 'lucide-react'
import { TASK_STATUS_META } from '@/utils/format'
import styles from './TaskFilters.module.css'

interface TaskFiltersProps {
  q: string
  status: string
  onSearchChange: (value: string) => void
  onStatusChange: (value: string) => void
}

export function TaskFilters({
  q,
  status,
  onSearchChange,
  onStatusChange,
}: TaskFiltersProps) {
  return (
    <div className={styles.filters}>
      <div className={styles.searchWrap}>
        <Search size={16} className={styles.searchIcon} />
        <input
          type="search"
          className={styles.search}
          placeholder="Поиск по названию"
          value={q}
          onChange={(event) => onSearchChange(event.target.value)}
        />
      </div>
      <select
        className={styles.filterSelect}
        value={status}
        onChange={(event) => onStatusChange(event.target.value)}
      >
        <option value="">Все статусы</option>
        {Object.entries(TASK_STATUS_META).map(([value, meta]) => (
          <option key={value} value={value}>
            {meta.label}
          </option>
        ))}
      </select>
    </div>
  )
}
