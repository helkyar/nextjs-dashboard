import Breadcrumbs from '@/ui/invoices/breadcrumbs'
import { fetchCustomerById } from '@/lib/data'
import { notFound } from 'next/navigation'
import EditCustomerForm from '@/ui/invoices/edit-customer'

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params
  const id = params.id
  const customer = await fetchCustomerById(id)

  if (!customer) notFound()

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Customers', href: '/dashboard/customers' },
          {
            label: 'Edit Invoice',
            href: `/dashboard/customers/${id}/edit`,
            active: true,
          },
        ]}
      />
      <EditCustomerForm customer={customer} />
    </main>
  )
}
