'use client'

import { CustomerField, InvoiceForm } from '@/lib/definitions'
import { toast } from '@/ui/toast'
import { redirect } from 'next/navigation'
import { useActionState } from 'react'
import { GeneralInvoiceForm } from '@/ui/invoices/invoice-form'
import { State, updateInvoice } from '@/app/dashboard/invoices/_lib/actions'

//FIXME-PRIO-LOW: single responsibility principle user interface (toaster)

export default function EditInvoiceForm({
  invoice,
  customers,
}: {
  readonly invoice?: InvoiceForm
  readonly customers: CustomerField[]
}) {
  // const updateInvoiceWithId = updateInvoice.bind(null, invoice.id)
  const handleUpdateInvoice = async (_: State, formData: FormData) => {
    if (!invoice?.id) return { message: 'Invoice not found' }
    const { success, error, ...state } = await updateInvoice(
      formData,
      invoice.id
    )

    if (error) toast.error(error)
    if (success) {
      toast.success(success)
      redirect('/dashboard/invoices')
    }

    return state
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
