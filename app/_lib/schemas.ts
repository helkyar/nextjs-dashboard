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

export const RegisterSchema = schema
  .object({
    username: schema.string({
      invalid_type_error: 'Please enter a username',
    }),
    email: schema
      .string({ invalid_type_error: 'Please enter a email' })
      .email({ message: 'Please enter a valid email' }),
    password: schema
      .string({ invalid_type_error: 'Please enter a password' })
      .min(6, { message: 'Password must be at least 6 characters long' }),
    passwordConfirmation: schema
      .string({ invalid_type_error: 'Please enter a password' })
      .min(6, { message: 'Password must be at least 6 characters long' }),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: 'Passwords should match',
    path: ['passwordConfirmation'],
  })
