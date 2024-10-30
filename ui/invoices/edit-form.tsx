'use client'

import { CustomerField, InvoiceForm } from '@/lib/definitions'
import { State, updateInvoice } from '@/lib/actions'
import { toast } from '@/ui/toast'
import { redirect } from 'next/navigation'
import { useActionState } from 'react'
import { GeneralInvoiceForm } from '@/ui/invoices/invoice-form'

export default function EditInvoiceForm({
  invoice,
  customers,
}: {
  invoice?: InvoiceForm
  customers: CustomerField[]
}) {
  // const updateInvoiceWithId = updateInvoice.bind(null, invoice.id)
  const handleUpdateInvoice = async (prev: State, formData: FormData) => {
    if (!invoice?.id) return { message: 'Invoice not found' }
    const resp = await updateInvoice(formData, invoice.id)

    if (resp.error) toast.error(resp.error)
    if (resp.success) {
      toast.success(resp.success)
      redirect('/dashboard/invoices')
    }

    return resp
  }

  const initialState: State = { message: null, errors: {} }
  const [state, formAction, isSubmitting] = useActionState(
    handleUpdateInvoice,
    initialState
  )

  return (
    <GeneralInvoiceForm
      invoice={invoice}
      state={state}
      action={formAction}
      customers={customers}
      isSubmitting={isSubmitting}
    />
  )
}
