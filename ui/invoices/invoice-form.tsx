import { CustomerField, InvoiceForm } from '@/lib/definitions'
import {
  CheckIcon,
  ClockIcon,
  CurrencyDollarIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline'

import InputError from '@/ui/input-error'
import InputErrorMessage from '@/ui/input-error-form'
import Link from 'next/link'
import { Button } from '@/ui/button'
import clsx from 'clsx'
import { State } from '@/app/dashboard/invoices/_lib/actions'

export function GeneralInvoiceForm({
  invoice,
  action,
  state,
  customers,
  isSubmitting,
}: {
  invoice?: InvoiceForm
  customers: CustomerField[]
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
              Choose customer
            </label>
            <div className='relative'>
              <select
                id='customer'
                name='customerId'
                className={clsx(
                  'peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500',
                  {
                    'cursor-pointer': !isSubmitting,
                    'cursor-not-allowed': isSubmitting,
                  }
                )}
                defaultValue={invoice?.customer_id || ''}
                aria-describedby='customer-error'
              >
                <option value='' disabled>
                  Select a customer
                </option>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name}
                  </option>
                ))}
              </select>
              <UserCircleIcon className='pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500' />
            </div>
            <InputError id='customer-error' errors={state.errors?.customerId} />
          </div>

          {/* Invoice Amount */}
          <div className='mb-4'>
            <label htmlFor='amount' className='mb-2 block text-sm font-medium'>
              Choose an amount
            </label>
            <div className='relative mt-2 rounded-md'>
              <div className='relative'>
                <input
                  id='amount'
                  name='amount'
                  type='number'
                  step='0.01'
                  defaultValue={invoice?.amount}
                  placeholder='Enter USD amount'
                  className='peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500'
                  aria-describedby='amount-error'
                />
                <CurrencyDollarIcon className='pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900' />
              </div>
            </div>{' '}
            <InputError id='amount-error' errors={state.errors?.amount} />
          </div>

          {/* Invoice Status */}
          <fieldset aria-describedby='status-error'>
            <legend className='mb-2 block text-sm font-medium'>
              Set the invoice status
            </legend>
            <div className='rounded-md border border-gray-200 bg-white px-[14px] py-3'>
              <div className='flex gap-4'>
                <div className='flex items-center'>
                  <input
                    id='pending'
                    name='status'
                    type='radio'
                    value='pending'
                    defaultChecked={invoice?.status === 'pending'}
                    className={clsx(
                      'h-4 w-4 border-gray-300 bg-gray-100 text-gray-600 focus:ring-2',
                      {
                        'cursor-pointer': !isSubmitting,
                        'cursor-not-allowed': isSubmitting,
                      }
                    )}
                  />
                  <label
                    htmlFor='pending'
                    className={clsx(
                      'ml-2 flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600',
                      {
                        'cursor-pointer': !isSubmitting,
                        'cursor-not-allowed': isSubmitting,
                      }
                    )}
                  >
                    Pending <ClockIcon className='h-4 w-4' />
                  </label>
                </div>
                <div className='flex items-center'>
                  <input
                    id='paid'
                    name='status'
                    type='radio'
                    value='paid'
                    defaultChecked={invoice?.status === 'paid'}
                    className={clsx(
                      'h-4 w-4 border-gray-300 bg-gray-100 text-gray-600 focus:ring-2',
                      {
                        'cursor-pointer': !isSubmitting,
                        'cursor-not-allowed': isSubmitting,
                      }
                    )}
                  />
                  <label
                    htmlFor='paid'
                    className={clsx(
                      'ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-green-500 px-3 py-1.5 text-xs font-medium text-white',
                      {
                        'cursor-pointer': !isSubmitting,
                        'cursor-not-allowed': isSubmitting,
                      }
                    )}
                  >
                    Paid <CheckIcon className='h-4 w-4' />
                  </label>
                </div>
              </div>
            </div>
          </fieldset>
          <InputError id='status-error' errors={state.errors?.status} />
          <InputErrorMessage id='message-error' error={state.message} />
        </div>
        <div className='mt-6 flex justify-end gap-4'>
          <Link
            href='/dashboard/invoices'
            className='flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200'
          >
            Cancel
          </Link>
          <Button disabled={isSubmitting} type='submit'>
            {invoice ? 'Edit' : 'Create'} Invoice
          </Button>
        </div>
      </fieldset>
    </form>
  )
}
