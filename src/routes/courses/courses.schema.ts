import { z } from 'zod'

export const createCourseSchema = z.object({
  code: z.string().min(1),
  name: z.string().min(1),
  sks: z.number().int().positive(),
  lecturerName: z.string().optional(),
  room: z.string().optional(),
  semester: z.number().int().positive().default(1),
  cover: z.string().optional(),
})

export const updateCourseSchema = createCourseSchema
  .extend({ status: z.enum(['aktif', 'selesai', 'cuti']) })
  .partial()

export type CreateCourseInput = z.infer<typeof createCourseSchema>
export type UpdateCourseInput = z.infer<typeof updateCourseSchema>
