import { z } from 'zod'

export const taskSchema = z.object({
  _id: z.string(),
  title: z.string(),
  instructions: z.string(),
  priority: z.enum(['low', 'medium', 'high']),
  location: z.string(),
  deadline: z.string(),
  assignedTo: z.string(),

  workerId: z.object({
    _id: z.string(),
    name: z.string(),
    phone: z.string(),
    chatId: z.string(),
  }),

  tenantId: z.string(),

  status: z.enum(['sent', 'accepted', 'in_progress', 'completed', 'rejected']),

  reminderSent: z.boolean(),
  helpRequests: z.array(z.unknown()),

  createdAt: z.string(),
  updatedAt: z.string(),
  __v: z.number(),

  delayReason: z.string().optional(),
  newDeadline: z.string().optional(),
  completedAt: z.string().optional(),
})

export type Task = z.infer<typeof taskSchema>
