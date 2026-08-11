import { useState } from 'react'
import type { Task } from '@/types/task'

export function useTaskDialogs() {
  const [modal, setModal] = useState<{ open: boolean; task?: Task }>({
    open: false,
  })
  const [deletingTask, setDeletingTask] = useState<Task | null>(null)

  return {
    modal,
    deletingTask,
    openCreate: () => setModal({ open: true }),
    openEdit: (task: Task) => setModal({ open: true, task }),
    closeModal: () => setModal({ open: false }),
    requestDelete: (task: Task) => setDeletingTask(task),
    closeDelete: () => setDeletingTask(null),
  }
}
