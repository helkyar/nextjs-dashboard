'use server'
import { isAllowed } from '@/auth/auth-provider'
import { schema, validateFormData } from '@/lib/schema-validation'
import { sql } from '@/lib/db-connection'
import { revalidatePath } from 'next/cache'
import { CostumerSchema } from '@/app/dashboard/customers/_lib/schemas'
import fs from 'fs/promises'
import { randomUUID } from 'crypto'
import { CustomerForm } from '@/lib/definitions'

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
  INSERT INTO customers (id, name, email, image_url)
  VALUES (${randomUUID()}, ${customerName}, ${email}, ${imageUrl})
`
    return { success: 'Customer created successfully.' }
  } catch (e) {
    console.log('🚀 ~ e:', e)
    return { error: 'Database Error: Failed to Create Customer.' }
  } finally {
    revalidatePath('/dashboard/customers')
  }
}

const UpdateCustomerSchema = CostumerSchema.omit({ id: true }).extend({
  image: schema.instanceof(File, {
    message: 'Please select an image',
  }),
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
    if (image && image.size > 0) {
      try {
        const data = await sql<CustomerForm>`
        SELECT
          image_url
        FROM customers
        WHERE id = ${id}
      `

        const customer = data.rows[0]
        await fs.unlink(`public${customer.image_url}`)
      } catch (e) {
        console.log('🚀 ~ e:', e)
      }

      const imageUrl = `/customers/${image.name}`
      await fs.writeFile(
        `public${imageUrl}`,
        new Uint8Array(await image.arrayBuffer())
      )

      await sql`
      UPDATE customers
      SET name = ${customerName}, 
      email = ${email}, 
      image_url = ${imageUrl}
      WHERE id = ${id}
    `
    } else {
      await sql`
      UPDATE customers
      SET name = ${customerName}, 
      email = ${email}
      WHERE id = ${id}
      `
    }

    return { success: 'Customer updated successfully.' }
  } catch (e) {
    console.log('🚀 ~ e:', e)
    return { error: 'Customer update failed.' }
  } finally {
    revalidatePath('/dashboard/customers')
  }
}

export async function deleteCustomer(id: string) {
  if (!(await isAllowed())) return { error: 'Log in to delete a Customer.' }
  try {
    const data = await sql<CustomerForm>`
      SELECT
        image_url
      FROM customers
      WHERE id = ${id}
    `

    const customer = data.rows[0]
    await fs.unlink(`public${customer.image_url}`)

    await sql`
    DELETE FROM customers
    WHERE id = ${id}
    `
    return { success: 'Customer deleted successfully.' }
  } catch {
    return { error: 'Customer deletion failed.' }
  } finally {
    revalidatePath('/dashboard/customers')
  }
}
