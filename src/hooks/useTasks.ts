import { useQuery } from '@tanstack/react-query'
import type { Task } from '../types/task'

export function useTasks() {
  return useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      const response = await fetch('/api/tasks')
      if (!response.ok) throw new Error('сервер вернул ошибку')
      return response.json() as Promise<Task[]>
    },
  })
}
