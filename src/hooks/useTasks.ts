import { useQuery } from '@tanstack/react-query'
import type { Task } from '../types/task'

export function useTasks(search: string = '', status: string = '') {
  return useQuery({
    queryKey: ['tasks', search, status],
    queryFn: async () => {
      const params = new URLSearchParams()

      if (search) params.set('title_like', search)
      if (status) params.set('status', status)

      const query = params.toString()
      const response = await fetch(`/api/tasks${query ? `?${query}` : ''}`)

      if (!response.ok) throw new Error('сервер вернул ошибку')

      return response.json() as Promise<Task[]>
    },
  })
}
