import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { NewTask, Task } from '../types/task'

export function useUpdateTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ...fields }: { id: string } & NewTask) => {
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fields),
      })
      if (!response.ok) throw new Error('сервер вернул ошибку')
      return response.json() as Promise<Task>
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
  })
}
