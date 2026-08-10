import { useQuery } from '@tanstack/react-query'
import type { Task } from '../types/task'

export class TaskNotFoundError extends Error {
  constructor() {
    super('Задача не существует')
  }
}

export function useTask(id: string) {
  return useQuery({
    queryKey: ['task', id],
    queryFn: async () => {
      const response = await fetch(`/api/tasks/${id}`)
      if (response.status === 404) throw new TaskNotFoundError()
      if (!response.ok) throw new Error('сервер вернул ошибку')
      return response.json() as Promise<Task>
    },
  })
}
