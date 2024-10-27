'use server'

import { FormSchema } from '@/app/lib/schemas'
import { sql } from '@/app/lib/db-connection'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

const dateToDatabase = () => new Date().toISOString().split('T')[0]

const CreateInvoice = FormSchema.omit({ id: true, date: true })

export async function createInvoice(formData: FormData) {
  // const rawFormData = Object.fromEntries(formData.entries())
  const { customerId, amount, status } = CreateInvoice.parse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  })
  const amountInCents = amount * 100
  const date = dateToDatabase()

  await sql`
  INSERT INTO invoices (customer_id, amount, status, date)
  VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
`
  revalidatePath('/dashboard/invoices')
  redirect('/dashboard/invoices')
}
