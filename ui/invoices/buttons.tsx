'use client'
import { deleteCustomer } from '@/app/dashboard/customers/_lib/actions'
import { deleteInvoice } from '@/app/dashboard/invoices/_lib/actions'
import { Button } from '@/ui/button'
import { PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline'
import { Route } from 'next'
import Link from 'next/link'
import { useActionState } from 'react'
import { toast } from 'sonner'

export function CreateInvoice() {
  return (
    <Link
      href={'/dashboard/invoices/create' as Route}
      className='flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'
    >
      <span className='hidden md:block'>Create Invoice</span>
      <PlusIcon className='h-5 md:ml-4' />
    </Link>
  )
}
export function CreateCustomer() {
  return (
    <Link
      href={'/dashboard/customers/create' as Route}
      className='flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'
    >
      <span className='hidden md:block'>Create Customer</span>
      <PlusIcon className='h-5 md:ml-4' />
    </Link>
  )
}

export function UpdateInvoice({ id }: { id: string }) {
  return (
    <Link
      href={`/dashboard/invoices/${id}/edit`}
      className='bg-gray-50 rounded-md border p-2 hover:bg-blue-600 hover:text-white'
    >
      <PencilIcon className='w-5' />
    </Link>
  )
}

export function DeleteInvoice({ id }: { id: string }) {
  // const deleteInvoiceWithId = deleteInvoice.bind(null, id)
  const handleDelete = async () => {
    const resp = await deleteInvoice(id)
    if (resp.success) toast.success(resp.success)
    if (resp.error) toast.error(resp.error)
  }
  const [_, formAction, isSubmitting] = useActionState(handleDelete, undefined)

  return (
    <form action={formAction}>
      <Button
        disabled={isSubmitting}
        type='submit'
        className='rounded-md border hover:bg-red-500 hover:stroke-white bg-gray-50 px-[.5rem] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600 active:bg-gray-100'
      >
        <span className='sr-only'>Delete</span>
        <TrashIcon className='w-5 fill-gray-600' />
      </Button>
    </form>
  )
}

export function UpdateCustomer({ id }: { id: string }) {
  return (
    <Link
      href={`/dashboard/customers/${id}/edit`}
      className='rounded-md border p-2 hover:bg-blue-600 hover:text-white bg-gray-50'
    >
      <PencilIcon className='w-5' />
    </Link>
  )
}

export function DeleteCustomer({ id }: { id: string }) {
  const handleDelete = async () => {
    const resp = await deleteCustomer(id)
    if (resp.success) toast.success(resp.success)
    if (resp.error) toast.error(resp.error)
  }
  const [_, formAction, isSubmitting] = useActionState(handleDelete, undefined)

  return (
    <form action={formAction}>
      <Button
        disabled={isSubmitting}
        type='submit'
        className='rounded-md border hover:bg-red-500 hover:stroke-white bg-gray-50 px-[.5rem] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600 active:bg-gray-100'
      >
        <span className='sr-only'>Delete</span>
        <TrashIcon className='w-5 fill-gray-600' />
      </Button>
    </form>
  )
}
