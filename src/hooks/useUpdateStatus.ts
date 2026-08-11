import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { Task, TaskStatus } from '@/types/task'

export function useUpdateStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: TaskStatus }) => {
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      if (!response.ok) throw new Error('сервер вернул ошибку')
      return response.json() as Promise<Task>
    },
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: ['tasks'] })

      const previousTasks = queryClient.getQueryData<Task[]>(['tasks'])

      queryClient.setQueryData<Task[]>(['tasks'], (old) =>
        old?.map((task) => (task.id === id ? { ...task, status } : task)),
      )
      return { previousTasks }
    },
    onError: (_error, _variables, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData<Task[]>(['tasks'], context.previousTasks)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      queryClient.invalidateQueries({ queryKey: ['task'] })
    },
  })
}
