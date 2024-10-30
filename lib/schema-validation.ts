import { z as schema } from 'zod'
export { schema }

export const validateFormData = <T extends schema.ZodSchema<unknown>>(
  schema: T,
  formData: FormData,
  { errorMessage }: { errorMessage?: string } = {}
) => {
  const rawFormData = Object.fromEntries(formData.entries())
  const validatedFields = schema.safeParse(
    rawFormData
  ) as schema.SafeParseReturnType<typeof rawFormData, schema.infer<T>>

  if (!validatedFields.success) {
    return {
      error: {
        errors: validatedFields.error.flatten().fieldErrors,
        message: errorMessage,
      },
    }
  }

  return { data: validatedFields.data }
}
