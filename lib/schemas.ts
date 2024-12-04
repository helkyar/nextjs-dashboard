import { schema } from '@/lib/schema-validation'

//FIXME-PRIO-LOW: too many strings
export const LoginSchema = schema.object({
  email: schema
    .string({ invalid_type_error: 'Please enter an email' })
    .email({ message: 'Please enter a valid email' }),
  password: schema
    .string({ invalid_type_error: 'Please enter a password' })
    .min(6, { message: 'Password must be at least 6 characters long' }),
})
