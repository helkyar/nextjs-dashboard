import { schema } from '@/lib/schema-validation'

export const CostumerSchema = schema.object({
  id: schema.string(),
  customerName: schema.string({
    invalid_type_error: 'Please select a customer.',
  }),
  email: schema
    .string({ invalid_type_error: 'Please enter an email' })
    .email({ message: 'Please enter a valid email' }),
  image: schema
    .instanceof(File, {
      message: 'Please select an image',
    })
    .refine(
      (file) => file.size > 0 && file.type.startsWith('image/'),
      'Please select an image'
    ),
})
