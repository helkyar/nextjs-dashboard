import { schema } from '@/lib/schema-validation'

export const InvoiceSchema = schema.object({
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
  createdAt: schema.string(),
  due: schema.string(),
})
