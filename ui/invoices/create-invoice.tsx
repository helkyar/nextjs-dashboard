'use client'

import { CustomerField } from '@/lib/definitions'
import { toast } from '@/ui/toast'
import { useActionState } from 'react'
import { GeneralInvoiceForm } from '@/ui/invoices/invoice-form'
import { createInvoice, State } from '@/app/dashboard/invoices/_lib/actions'

//FIXME-PRIO-LOW: single responsibility principle user interface (toaster)

export default function CreateInvoiceForm({
  customers,
}: {
  readonly customers: CustomerField[]
}) {
  const handleCreateInvoice = async (_: State, formData: FormData) => {
    const { success, error, ...state } = await createInvoice(formData)

    if (success) toast.success(success)
    if (error) toast.error(error)

    return state
  }
  const initialState: State = { message: null, errors: {} }
  const [state, formAction, isSubmitting] = useActionState(
    handleCreateInvoice,
    initialState
  )
  return (
    <GeneralInvoiceForm
      state={state}
      action={formAction}
      customers={customers}
      isSubmitting={isSubmitting}
    />
  )
}
