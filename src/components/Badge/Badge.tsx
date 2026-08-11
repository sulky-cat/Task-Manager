import type { TaskMeta } from '@/utils/format'
import styles from './Badge.module.css'

interface BadgeProps {
  meta: TaskMeta
}

export function Badge({ meta }: BadgeProps) {
  return (
    <span
      className={styles.badge}
      style={{ color: meta.color, background: meta.background }}
    >
      {meta.label}
    </span>
  )
}
