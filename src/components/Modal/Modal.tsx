import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import type { ReactNode } from 'react'
import styles from './Modal.module.css'

interface ModalProps {
  open?: boolean
  title: string
  onClose: () => void
  children: ReactNode
}

export function Modal({ open = true, title, onClose, children }: ModalProps) {
  if (!open) return null

  return createPortal(
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        onClick={(event) => event.stopPropagation()}
      >
        <div className={styles.header}>
          <h2 className={styles.title}>{title}</h2>
          <button
            type="button"
            className={styles.close}
            aria-label="Закрыть"
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>,
    document.body,
  )
}
