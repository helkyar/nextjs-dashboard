import { fetchFilteredCustomers } from '@/lib/data'
import CustomersTable from '@/ui/customers/table'
import { Metadata } from 'next'

const searchQuery: string = 'paco'

type PropTypes = {
  searchParams?: Promise<{
    [key: string]: string | undefined
    page?: string
  }>
}

export const metadata: Metadata = {
  title: 'Costumers',
}
export default async function Page(props: PropTypes) {
  const searchParams = await props.searchParams
  const query = searchParams?.[searchQuery] || ''
  const currentPage = Number(searchParams?.page) || 1
  const customers = await fetchFilteredCustomers(query)

  return <CustomersTable customers={customers} query={searchQuery} />
}
