import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { NewTask, Task } from '../types/task'

export function useCreateTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (newTask: NewTask) => {
      const task: Task = {
        ...newTask,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
      }
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task),
      })
      if (!response.ok) throw new Error('сервер вернул ошибку')
      return response.json() as Promise<Task>
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      queryClient.invalidateQueries({ queryKey: ['task'] })
    },
  })
}
