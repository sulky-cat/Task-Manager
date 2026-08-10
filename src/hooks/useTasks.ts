import { useQuery } from '@tanstack/react-query'
import type { Task } from '../types/task'

export function useTasks(search: string = '') {
  return useQuery({
    queryKey: ['tasks', search],
    queryFn: async () => {
      const query = search ? `?title_like=${encodeURIComponent(search)}` : ''
      const response = await fetch(`/api/tasks${query}`)
      if (!response.ok) throw new Error('сервер вернул ошибку')
      return response.json() as Promise<Task[]>
    },
  })
}
