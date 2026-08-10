import { useMutation, useQueryClient } from '@tanstack/react-query'

export function useDeleteTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/tasks/${id}`, { method: 'DELETE' })
      if (response.status === 404) throw new Error('Задача уже удалена на сервере')
      if (!response.ok) throw new Error('Не удалось удалить задачу. Проверьте, что сервер запущен.')
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      queryClient.invalidateQueries({ queryKey: ['task'] })
    },
  })
}
