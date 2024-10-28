'use client'

import { CustomerField } from '@/lib/definitions'
import { createInvoice, State } from '@/lib/actions'
import { toast } from '@/ui/toast'
import { useActionState } from 'react'
import { GeneralInvoiceForm } from '@/ui/invoices/invoice-form'

export default function Form({ customers }: { customers: CustomerField[] }) {
  const handleCreateInvoice = async (prevState: State, formData: FormData) => {
    const resp = await createInvoice(formData)

    if (resp.success) toast.success(resp.success)
    if (resp.error) toast.error(resp.error)

    return resp
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
