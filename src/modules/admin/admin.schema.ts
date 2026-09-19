import { z } from 'zod'

export const addAllowedEmailSchema = z.object({
  email: z.email().transform((v) => v.toLowerCase()),
})

export type AddAllowedEmailInput = z.infer<typeof addAllowedEmailSchema>
