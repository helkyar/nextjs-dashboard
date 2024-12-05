import CreateCustomerForm from '@/ui/customers/create-customer'
import Breadcrumbs from '@/ui/invoices/breadcrumbs'

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
