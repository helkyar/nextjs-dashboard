'use client'

import { CustomerForm } from '@/lib/definitions'
import { toast } from '@/ui/toast'
import { redirect } from 'next/navigation'
import { useActionState } from 'react'
import { State, updateCustomer } from '@/app/dashboard/customers/_lib/actions'
import { GeneralCustomerForm } from '@/ui/customers/customer-form'

//FIXME-PRIO-LOW: single responsibility principle user interface (toaster)

export default function EditCustomerForm({
  customer,
}: {
  readonly customer: CustomerForm
}) {
  // const updateInvoiceWithId = updateInvoice.bind(null, invoice.id)
  const handleUpdateCustomer = async (_: State, formData: FormData) => {
    if (!customer?.id) return { message: 'Invoice not found' }
    const { success, error, ...state } = await updateCustomer(
      formData,
      customer.id
    )

    if (error) toast.error(error)
    if (success) {
      toast.success(success)
      redirect('/dashboard/customers')
    }

    return state
  }

  const initialState: State = { message: null, errors: {} }
  const [state, formAction, isSubmitting] = useActionState(
    handleUpdateCustomer,
    initialState
  )

  return (
    <GeneralCustomerForm
      state={state}
      action={formAction}
      customer={customer}
      isSubmitting={isSubmitting}
    />
  )
}
