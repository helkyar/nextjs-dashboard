'use server'
import { isAllowed } from '@/auth/auth-provider'
import { validateFormData } from '@/lib/schema-validation'
import { sql } from '@/lib/db-connection'
import { revalidatePath } from 'next/cache'
import { CostumerSchema } from '@/app/dashboard/customers/_lib/schemas'
import fs from 'fs/promises'

const customerTable = 'customers'

export type State = {
  errors?: {
    customerName?: string[]
    email?: string[]
    image?: string[]
  }
  message?: string | null
}
type ExtendedState = State & { success?: string; error?: string }

const CreateCustomerSchema = CostumerSchema.omit({ id: true })

export async function createCustomer(
  formData: FormData
): Promise<ExtendedState> {
  if (!(await isAllowed())) return { error: 'Log in to Create a costumer.' }

  const validatedFields = validateFormData(CreateCustomerSchema, formData, {
    errorMessage: 'Missing Fields. Failed to Create Customer.',
  })

  if (validatedFields.error) return validatedFields.error
  const { customerName, email, image } = validatedFields.data

  try {
    const imageUrl = `/customers/${image.name}`
    await fs.writeFile(
      `public${imageUrl}`,
      new Uint8Array(await image.arrayBuffer())
    )
    await sql`
  INSERT INTO ${customerTable} (name, email, image_url)
  VALUES (${customerName}, ${email}, ${imageUrl})
`
    return { success: 'Customer created successfully.' }
  } catch {
    return { error: 'Database Error: Failed to Create Customer.' }
  } finally {
    revalidatePath('/dashboard/customers')
  }
}

const UpdateCustomerSchema = CostumerSchema.omit({ id: true }).partial({
  image: true,
})
export async function updateCustomer(
  formData: FormData,
  id: string
): Promise<ExtendedState> {
  if (!(await isAllowed())) return { error: 'Log in to update a Customer.' }

  const validatedFields = validateFormData(UpdateCustomerSchema, formData, {
    errorMessage: 'Missing Fields. Failed to Update Customer.',
  })

  if (validatedFields.error) return validatedFields.error
  const { customerName, email, image } = validatedFields.data

  try {
    if (image) {
      const imageUrl = `/customers/${image.name}`
      await fs.writeFile(
        `public${imageUrl}`,
        new Uint8Array(await image.arrayBuffer())
      )
      await sql`
      UPDATE ${customerTable}
      SET name = ${customerName}, 
      email = ${email}, 
      image_url = ${imageUrl}
      WHERE id = ${id}
    `
    } else {
      await sql`
      UPDATE ${customerTable}
      SET name = ${customerName}, 
      email = ${email}, 
      WHERE id = ${id}
      `
    }

    return { success: 'Customer updated successfully.' }
  } catch {
    return { error: 'Customer update failed.' }
  } finally {
    revalidatePath('/dashboard/customers')
  }
}

export async function deleteCustomer(id: string) {
  if (!(await isAllowed())) return { error: 'Log in to delete a Customer.' }
  try {
    await sql`
    DELETE FROM ${customerTable}
    WHERE id = ${id}
    `
    return { success: 'Customer deleted successfully.' }
  } catch {
    return { error: 'Customer deletion failed.' }
  } finally {
    revalidatePath('/dashboard/customers')
  }
}
