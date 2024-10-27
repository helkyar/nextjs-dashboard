import Pagination from '@/ui/invoices/pagination'
import Search from '@/ui/search'
import Table from '@/ui/invoices/table'
import { CreateInvoice } from '@/ui/invoices/buttons'
import { lusitana } from '@/ui/fonts'
import { InvoicesTableSkeleton } from '@/ui/skeletons'
import { Suspense } from 'react'
import { fetchInvoicesPages } from '@/lib/data'
import { Metadata } from 'next'

const searchQuery: string = 'query'

type PropTypes = {
  searchParams?: Promise<{
    [key: string]: string | undefined
    page?: string
  }>
}

export const metadata: Metadata = {
  title: 'Invoices',
}
export default async function Page(props: PropTypes) {
  const searchParams = await props.searchParams
  const query = searchParams?.[searchQuery] || ''
  const currentPage = Number(searchParams?.page) || 1

  const totalPages = await fetchInvoicesPages(query)

  return (
    <div className='w-full'>
      <div className='flex w-full items-center justify-between'>
        <h1 className={`${lusitana.className} text-2xl`}>Invoices</h1>
      </div>
      <div className='mt-4 flex items-center justify-between gap-2 md:mt-8'>
        <Search placeholder='Search invoices...' query={searchQuery} />
        <CreateInvoice />
      </div>
      <Suspense key={query + currentPage} fallback={<InvoicesTableSkeleton />}>
        <Table query={query} currentPage={currentPage} />
      </Suspense>
      <div className='mt-5 flex w-full justify-center'>
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  )
}
