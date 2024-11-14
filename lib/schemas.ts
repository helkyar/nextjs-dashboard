import { schema } from '@/lib/schema-validation'

//FIXME-PRIO-LOW: too many strings

export const FormSchema = schema.object({
  id: schema.string(),
  customerId: schema.string({
    invalid_type_error: 'Please select a customer.',
  }),
  amount: schema.coerce
    .number()
    .gt(0, { message: 'Please enter an amount greater than $0.' }),
  status: schema.enum(['pending', 'paid'], {
    invalid_type_error: 'Please select an invoice status.',
  }),
  date: schema.string(),
})

export const LoginSchema = schema.object({
  email: schema
    .string({ invalid_type_error: 'Please enter an email' })
    .email({ message: 'Please enter a valid email' }),
  password: schema
    .string({ invalid_type_error: 'Please enter a password' })
    .min(6, { message: 'Password must be at least 6 characters long' }),
})
