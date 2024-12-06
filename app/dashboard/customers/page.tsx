import { fetchCustomersPages, getUrlParams } from '@/lib/data'
import CustomersTable from '@/ui/customers/table'
import { lusitana } from '@/ui/fonts'
import { CreateCustomer } from '@/ui/invoices/buttons'
import Pagination from '@/ui/invoices/pagination'
import Search from '@/ui/search'
import { InvoicesTableSkeleton } from '@/ui/skeletons'
import { Metadata } from 'next'
import { Suspense } from 'react'

type PropTypes = {
  searchParams?: Promise<{
    [key: string]: string | undefined
    page?: string
  }>
}

export const metadata: Metadata = {
  title: 'Costumers',
}
export default async function CustomersPage(props: PropTypes) {
  const { query, currentPage, searchQuery } = await getUrlParams(props)

  const totalPages = await fetchCustomersPages(query)

  return (
    <div className='w-full'>
      <h1 className={`${lusitana.className} mb-8 text-xl md:text-2xl`}>
        Customers
      </h1>

      <div className='mt-4 flex items-center justify-between gap-2 md:mt-8'>
        <Search placeholder='Search customers...' query={searchQuery} />
        <CreateCustomer />
      </div>
      <Suspense key={query + currentPage} fallback={<InvoicesTableSkeleton />}>
        <CustomersTable currentPage={currentPage} query={query} />
      </Suspense>
      <div className='mt-5 flex w-full justify-center'>
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  )
}
