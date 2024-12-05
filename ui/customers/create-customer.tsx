'use client'

import { toast } from '@/ui/toast'
import { useActionState } from 'react'
import { createCustomer, State } from '@/app/dashboard/customers/_lib/actions'
import { GeneralCustomerForm } from '@/ui/customers/customer-form'

//FIXME-PRIO-LOW: single responsibility principle user interface (toaster)

export default function CreateCustomerForm() {
  const handleCreateInvoice = async (_: State, formData: FormData) => {
    const { success, error, ...state } = await createCustomer(formData)

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
    <GeneralCustomerForm
      state={state}
      action={formAction}
      isSubmitting={isSubmitting}
    />
  )
}
