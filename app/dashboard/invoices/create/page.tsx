import Breadcrumbs from '@/ui/invoices/breadcrumbs'
import { fetchCustomers } from '@/lib/data'
import CreateInvoiceForm from '@/ui/invoices/create-invoice'

export default async function CreateInvoice() {
  const customers = await fetchCustomers()

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Invoices', href: '/dashboard/invoices' },
          {
            label: 'Create Invoice',
            href: '/dashboard/invoices/create',
            active: true,
          },
        ]}
      />
      <CreateInvoiceForm customers={customers} />
    </main>
  )
}
