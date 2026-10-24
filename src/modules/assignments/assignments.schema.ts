import { z } from 'zod'

export const statusEnum = z.enum(['todo', 'in_progress', 'done'])
export const priorityEnum = z.enum(['low', 'medium', 'high', 'urgent'])

export const createAssignmentSchema = z.object({
  courseId: z.string().min(1),  
  title: z.string().min(1),
  notes: z.string().optional(),
  taskUrl: z.string().optional(),
  priority: priorityEnum.optional(),
  status: statusEnum.optional(),
  dueAt: z.coerce.date().optional(),
  reminderAt: z.coerce.date().optional(),
  grade: z.number().optional(),
})

export const updateAssignmentSchema = z.object({
  courseId: z.string().min(1).optional(),
  title: z.string().min(1).optional(),
  notes: z.string().nullish(),
  taskUrl: z.string().nullish(),
  priority: priorityEnum.nullish(),
  status: statusEnum.optional(),
  dueAt: z.coerce.date().nullish(),
  reminderAt: z.coerce.date().nullish(),
  submittedAt: z.coerce.date().nullish(),
  grade: z.number().nullish(),
})

export const listAssignmentsQuerySchema = z.object({
  search: z.string().trim().min(1).optional(),
  status: statusEnum.optional(),
  priority: priorityEnum.optional(),
  courseId: z.string().min(1).optional(),
  order: z.enum(['asc', 'desc']).default('desc'),
})

export type CreateAssignmentInput = z.infer<typeof createAssignmentSchema>
export type UpdateAssignmentInput = z.infer<typeof updateAssignmentSchema>
export type ListAssignmentsQuery = z.infer<typeof listAssignmentsQuerySchema>
