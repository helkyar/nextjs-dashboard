'use server'
import { isAllowed } from '@/auth/auth-provider'
import { validateFormData } from '@/lib/schema-validation'
import { sql } from '@/lib/db-connection'
import { revalidatePath } from 'next/cache'
import { CostumerSchema } from '@/app/dashboard/customers/_lib/schemas'

export type State = {
  errors?: {
    customerId?: string[]
    amount?: string[]
    status?: string[]
  }
  message?: string | null
}
type ExtendedState = State & { success?: string; error?: string }

const CreateInvoice = CostumerSchema.omit({ id: true, date: true })
export async function createInvoice(
  formData: FormData
): Promise<ExtendedState> {
  if (!(await isAllowed())) return { error: 'Log in to Create a costumer.' }

  const validatedFields = validateFormData(CreateInvoice, formData, {
    errorMessage: 'Missing Fields. Failed to Create Invoice.',
  })

  if (validatedFields.error) return validatedFields.error
  const { customerId, amount, status } = validatedFields.data
  const amountInCents = amount * 100
  const date = new Date().toISOString().split('T')[0]

  try {
    await sql`
  INSERT INTO invoices (customer_id, amount, status, date)
  VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
`
    return { success: 'Invoice created successfully.' }
  } catch {
    return { error: 'Database Error: Failed to Create Invoice.' }
  } finally {
    revalidatePath('/dashboard/invoices')
  }
}

const UpdateInvoice = CostumerSchema.omit({ id: true, date: true })
export async function updateInvoice(
  formData: FormData,
  id: string
): Promise<ExtendedState> {
  if (!(await isAllowed())) return { error: 'Log in to update an invoice.' }

  const validatedFields = validateFormData(UpdateInvoice, formData, {
    errorMessage: 'Missing Fields. Failed to Update Invoice.',
  })

  if (validatedFields.error) return validatedFields.error
  const { customerId, amount, status } = validatedFields.data
  const amountInCents = amount * 100
  try {
    await sql`
      UPDATE invoices
      SET customer_id = ${customerId}, 
      amount = ${amountInCents}, 
      status = ${status}
      WHERE id = ${id}
    `

    return { success: 'Invoice updated successfully.' }
  } catch {
    return { error: 'Invoice update failed.' }
  } finally {
    revalidatePath('/dashboard/invoices')
  }
}

export async function deleteInvoice(id: string) {
  if (!(await isAllowed())) return { error: 'Log in to delete an invoice.' }
  try {
    await sql`
    DELETE FROM invoices
    WHERE id = ${id}
    `
    return { success: 'Invoice deleted successfully.' }
  } catch {
    return { error: 'Invoice deletion failed.' }
  } finally {
    revalidatePath('/dashboard/invoices')
  }
}
