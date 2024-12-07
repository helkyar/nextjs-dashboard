'use client'
import { lusitana } from '@/ui/fonts'
import {
  AtSymbolIcon,
  KeyIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline'
import { ArrowRightIcon } from '@heroicons/react/20/solid'
import { Button } from '@/ui/button'
import { useActionState } from 'react'
import { toast } from '@/ui/toast'
import InputError from '@/ui/input-error'
import InputErrorMessage from '@/ui/input-error-form'
import { register, RegisterState } from '@/app/_lib/actions'

export default function RegisterForm({
  onSuccess,
}: {
  readonly onSuccess: () => void
}) {
  const handleRegister = async (_: RegisterState, formData: FormData) => {
    const resp = await register(formData)
    if (resp.error) toast.error(resp.error)
    if (resp.success) {
      toast.success(resp.success)
      onSuccess()
    }
    return resp
  }
  const initialState: RegisterState = { message: null, errors: {} }
  const [errorMessage, formAction, isPending] = useActionState(
    handleRegister,
    initialState
  )

  return (
    <>
      <form action={formAction} className='space-y-3'>
        <div className='flex-1 rounded-lg bg-white bg-opacity-50 px-6 pb-4 pt-8'>
          <h1 className={`${lusitana.className} mb-3 text-2xl`}>
            Please Register to continue.
          </h1>
          <fieldset disabled={isPending}>
            <div className='w-full'>
              <div>
                <label
                  className='mb-3 mt-5 block text-xs font-medium text-gray-900'
                  htmlFor='email'
                >
                  Username
                </label>
                <div className='relative'>
                  <input
                    className='peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500'
                    id='username'
                    type='text'
                    name='username'
                    placeholder='Enter your username'
                    aria-describedby='username-error'
                  />
                  <UserCircleIcon className='pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900' />
                </div>

                <InputError
                  errors={errorMessage?.errors?.username}
                  id='username-error'
                />
              </div>
              <div className='mt-4'>
                <label
                  className='mb-3 mt-5 block text-xs font-medium text-gray-900'
                  htmlFor='email'
                >
                  Email
                </label>
                <div className='relative'>
                  <input
                    className='peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500'
                    id='email'
                    type='text'
                    name='email'
                    placeholder='Enter your email address'
                    aria-describedby='email-error'
                  />
                  <AtSymbolIcon className='pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900' />
                </div>

                <InputError
                  errors={errorMessage?.errors?.email}
                  id='email-error'
                />
              </div>
              <div className='mt-4'>
                <label
                  className='mb-3 mt-5 block text-xs font-medium text-gray-900'
                  htmlFor='password'
                >
                  Password
                </label>
                <div className='relative'>
                  <input
                    className='peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500'
                    id='password'
                    type='password'
                    name='password'
                    placeholder='Enter password'
                    aria-describedby='password-error'
                  />
                  <KeyIcon className='pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900' />
                </div>
                <InputError
                  errors={errorMessage?.errors?.password}
                  id='password-error'
                />
              </div>
              <div className='mt-4'>
                <label
                  className='mb-3 mt-5 block text-xs font-medium text-gray-900'
                  htmlFor='password-confirmation'
                >
                  Confirm Password
                </label>
                <div className='relative'>
                  <input
                    className='peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500'
                    id='password-confirmation'
                    type='password'
                    name='passwordConfirmation'
                    placeholder='Enter password'
                    aria-describedby='password-confirmation-error'
                  />
                  <KeyIcon className='pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900' />
                </div>
                <InputError
                  errors={errorMessage?.errors?.passwordConfirmation}
                  id='password-confirmation-error'
                />
              </div>
            </div>
            <Button className='mt-4 w-full' disabled={isPending}>
              Register{' '}
              <ArrowRightIcon className='ml-auto h-5 w-5 text-gray-50' />
            </Button>
          </fieldset>
          <InputErrorMessage error={errorMessage?.message} id='message-error' />
        </div>
      </form>
    </>
  )
}
