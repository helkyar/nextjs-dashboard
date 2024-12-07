'use server'
import { InvoiceSchema } from '@/app/dashboard/invoices/_lib/schemas'
import { isAllowed } from '@/auth/auth-provider'
import { sql } from '@/lib/db-connection'
import { validateFormData } from '@/lib/schema-validation'
import { revalidatePath } from 'next/cache'

export type State = {
  errors?: {
    customerId?: string[]
    amount?: string[]
    status?: string[]
    due?: string[]
  }
  message?: string | null
}
type ExtendedState = State & { success?: string; error?: string }
const date = new Date().toISOString().split('T')[0]

const CreateInvoice = InvoiceSchema.omit({ id: true, createdAt: true })
export async function createInvoice(
  formData: FormData
): Promise<ExtendedState> {
  if (!(await isAllowed())) return { error: 'Log in to Create an invoice.' }

  const validatedFields = validateFormData(CreateInvoice, formData, {
    errorMessage: 'Missing Fields. Failed to Create Invoice.',
  })

  if (validatedFields.error) return validatedFields.error
  const { customerId, amount, status, due } = validatedFields.data
  const amountInCents = amount * 100

  const paidAt = status === 'paid' ? date : null

  try {
    await sql`
  INSERT INTO invoices (customer_id, amount, status, created_at, due_at, paid_at)
  VALUES (${customerId}, ${amountInCents}, ${status}, ${date}, ${due}, ${paidAt})
`
    return { success: 'Invoice created successfully.' }
  } catch {
    return { error: 'Database Error: Failed to Create Invoice.' }
  } finally {
    revalidatePath('/dashboard/invoices')
  }
}

const UpdateInvoice = InvoiceSchema.omit({ id: true, createdAt: true })
export async function updateInvoice(
  formData: FormData,
  id: string
): Promise<ExtendedState> {
  if (!(await isAllowed())) return { error: 'Log in to update an invoice.' }

  const validatedFields = validateFormData(UpdateInvoice, formData, {
    errorMessage: 'Missing Fields. Failed to Update Invoice.',
  })

  if (validatedFields.error) return validatedFields.error
  const { customerId, amount, status, due } = validatedFields.data
  const amountInCents = amount * 100
  try {
    const data = await sql`
    SELECT status FROM invoices WHERE id = ${id}`
    if (data.rows[0].status === 'pending' && status === 'paid') {
      await sql`
        UPDATE invoices
        SET customer_id = ${customerId}, 
        amount = ${amountInCents}, 
        status = ${status}
        paid_at = ${date}
        due_at = ${due}
        WHERE id = ${id}
      `
    } else {
      await sql`
      UPDATE invoices
      SET customer_id = ${customerId}, 
      amount = ${amountInCents}, 
      status = ${status}
      due_at = ${due}
      WHERE id = ${id}
      `
    }

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
