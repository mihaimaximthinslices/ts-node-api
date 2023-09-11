import { z } from 'zod'

export const registrationSchema = z.object({
  username: z.string().min(1), // You can specify the minimum length for the username here.
  email: z.string().email(),
  password: z.string().min(6), // Password must be at least 6 characters long.
})
