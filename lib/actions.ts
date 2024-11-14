'use server'

import { FormSchema, LoginSchema } from '@/lib/schemas'
import { sql } from '@/lib/db-connection'
import { revalidatePath } from 'next/cache'
import { signIn } from '@/auth/auth'
import { AuthError } from 'next-auth'
import { isRedirectError } from 'next/dist/client/components/redirect'
import { validateFormData } from '@/lib/schema-validation'
import { isAllowed } from '@/auth/auth-provider'
// import { authAccessControl } from '@/auth/auth-provider'

//FIXME-PRIO-MID: single responsibility principle error handling
//FIXME-PRIO-MID: single responsibility principle auth wrapper
//FIXME-PRIO-MID: single responsibility principle db call
//FIXME-PRIO-LOW: too many strings

export type State = {
  errors?: {
    customerId?: string[]
    amount?: string[]
    status?: string[]
  }
  message?: string | null
}
type ExtendedState = State & { success?: string; error?: string }

const CreateInvoice = FormSchema.omit({ id: true, date: true })

export async function createInvoice(
  formData: FormData
): Promise<ExtendedState> {
  if (!(await isAllowed())) return { error: 'Log in to Create an invoice.' }

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

const UpdateInvoice = FormSchema.omit({ id: true, date: true })
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

export async function authenticate(formData: FormData) {
  const validatedFields = validateFormData(LoginSchema, formData)
  if (validatedFields.error) return validatedFields.error

  try {
    await signIn('credentials', formData)

    return { success: 'Logged in successfully.' }
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return { message: 'Invalid credentials.' }
        default:
          return { message: 'Something went wrong.' }
      }
    }
    if (isRedirectError(error)) throw error
    return { error: 'Data Base error. Something went wrong.' }
  }
}

export async function googleLogin() {
  await signIn('google', { callbackUrl: '/dashboard' })
}
export async function githubLogin() {
  await signIn('github', { callbackUrl: '/dashboard' })
}
export async function emailLogin(formData: FormData) {
  await signIn('resend', formData)
}
