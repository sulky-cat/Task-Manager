import { z } from 'zod'

export const taskFormSchema = z.object({
  title: z.string().min(1, 'Название обязательно'),
  description: z.string(),
  status: z.enum(['todo', 'in_progress', 'done']),
  priority: z.enum(['low', 'medium', 'high']),
})

export type TaskFormValues = z.infer<typeof taskFormSchema>
