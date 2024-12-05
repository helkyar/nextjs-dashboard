import Breadcrumbs from '@/ui/invoices/breadcrumbs'
import CreateCustomerForm from '@/ui/invoices/create-customer'

export default async function CreateCustomers() {
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
      <CreateCustomerForm />
    </main>
  )
}
