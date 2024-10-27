import { schema } from '@/app/lib/schema-validation'

export const FormSchema = schema.object({
  id: schema.string(),
  customerId: schema.string(),
  amount: schema.coerce.number(),
  status: schema.enum(['pending', 'paid']),
  date: schema.string(),
})
