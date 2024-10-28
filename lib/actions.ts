'use server'

import { FormSchema, LoginSchema } from '@/lib/schemas'
import { sql } from '@/lib/db-connection'
import { revalidatePath } from 'next/cache'
import { signIn } from '@/auth/auth'
import { AuthError } from 'next-auth'
import { redirect } from 'next/navigation'

// hydration error
// const dateToDatabase = () => new Date().toISOString().split('T')[0]

export type State = {
  errors?: {
    customerId?: string[]
    amount?: string[]
    status?: string[]
  }
  message?: string | null
}

const CreateInvoice = FormSchema.omit({ id: true, date: true })
export async function createInvoice(formData: FormData) {
  // const rawFormData = Object.fromEntries(formData.entries())
  const validatedFields = CreateInvoice.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Invoice.',
    }
  }

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
export async function updateInvoice(formData: FormData, id?: string) {
  if (!id) return { message: 'Invoice not found' }

  const validatedFields = UpdateInvoice.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Invoice.',
    }
  }

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

export async function authenticate(
  prevState: string | undefined,
  formData: FormData
) {
  // const validatedFields = LoginSchema.safeParse({
  //   email: formData.get('email'),
  //   password: formData.get('password'),
  // })
  // if (!validatedFields.success) {
  //   return {
  //     errors: validatedFields.error.flatten().fieldErrors,
  //     message: 'Missing Fields. Fill them to login',
  //   }
  // }

  try {
    await signIn('credentials', formData)
    // return { success: 'Logged in successfully.' }
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          // return { errors: ['Invalid credentials.'] }
          return 'Invalid credentials.'
        default:
          // return { errors: ['Something went wrong.'] }
          return 'Something went wrong.'
      }
    }
    throw error
    // return { error: 'Database error: try again later' }
  }
  redirect('/dashboard')
}

export async function googleLogin() {
  await signIn('google')
}
export async function githubLogin() {
  await signIn('github')
}
export async function emailLogin(formData: FormData) {
  await signIn('resend', formData)
}
