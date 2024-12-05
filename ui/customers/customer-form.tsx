import { CustomerForm } from '@/lib/definitions'
import {
  EnvelopeIcon,
  PhotoIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline'

import InputError from '@/ui/input-error'
import InputErrorMessage from '@/ui/input-error-form'
import Link from 'next/link'
import { Button } from '@/ui/button'
import { State } from '@/app/dashboard/customers/_lib/actions'
import Image from 'next/image'

export function GeneralCustomerForm({
  customer,
  state,
  action,
  isSubmitting,
}: {
  customer?: CustomerForm
  state: State
  action: (formData: FormData) => void
  isSubmitting: boolean
}) {
  return (
    <form action={action}>
      <fieldset
        aria-disabled={isSubmitting}
        disabled={isSubmitting}
        className='aria-disabled:cursor-not-allowed aria-disabled:opacity-50'
      >
        <div className='rounded-md bg-gray-50 p-4 md:p-6'>
          {/* Customer Name */}
          <div className='mb-4'>
            <label
              htmlFor='customer'
              className='mb-2 block text-sm font-medium'
            >
              Customer name
            </label>
            <div className='relative'>
              <input
                id='customer'
                name='customerName'
                type='text'
                defaultValue={customer?.name}
                placeholder='Enter customer name'
                className='peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500'
                aria-describedby='customer-error'
              />
              <UserCircleIcon className='pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500' />
            </div>
            <InputError
              id='customer-error'
              errors={state.errors?.customerName}
            />
          </div>

          {/* Customer email */}
          <div className='mb-4'>
            <label htmlFor='email' className='mb-2 block text-sm font-medium'>
              Customer email
            </label>
            <div className='relative mt-2 rounded-md'>
              <div className='relative'>
                <input
                  id='email'
                  name='email'
                  type='text'
                  defaultValue={customer?.email}
                  placeholder='Enter customer email'
                  className='peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500'
                  aria-describedby='email-error'
                />
                <EnvelopeIcon className='pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900' />
              </div>
            </div>
            <InputError id='email-error' errors={state.errors?.email} />
          </div>

          {/* Customer image */}
          <div className='mb-4'>
            <label htmlFor='image' className='mb-2 block text-sm font-medium'>
              Customer email
            </label>
            <div className='relative mt-2 rounded-md'>
              <div className='relative'>
                <input
                  id='image'
                  name='image'
                  type='file'
                  placeholder='select image...'
                  className='peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500'
                  aria-describedby='image-error'
                />
                <PhotoIcon className='pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900' />
              </div>
            </div>
            {customer?.image_url && (
              <div className='mt-2 flex items-center gap-3'>
                <Image
                  src={customer?.image_url}
                  className='rounded-full'
                  alt={`${customer?.name}'s profile picture`}
                  width={28}
                  height={28}
                />
                <p className='text-gray-600 text-sm'>{customer?.image_url}</p>
              </div>
            )}
            <InputError id='image-error' errors={state.errors?.image} />
          </div>
          <InputErrorMessage id='message-error' error={state.message} />
        </div>
        <div className='mt-6 flex justify-end gap-4'>
          <Link
            href='/dashboard/customers'
            className='flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200'
          >
            Cancel
          </Link>
          <Button disabled={isSubmitting} type='submit'>
            {customer ? 'Edit' : 'Create'} Customer
          </Button>
        </div>
      </fieldset>
    </form>
  )
}
