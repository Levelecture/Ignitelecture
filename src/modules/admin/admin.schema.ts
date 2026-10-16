import { z } from 'zod'

export const addAllowedEmailSchema = z.object({
  email: z.string().trim().toLowerCase().pipe(z.email()),
})

export type AddAllowedEmailInput = z.infer<typeof addAllowedEmailSchema>
