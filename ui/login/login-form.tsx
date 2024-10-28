'use client'
import { lusitana } from '@/ui/fonts'
import {
  AtSymbolIcon,
  KeyIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline'
import { ArrowRightIcon } from '@heroicons/react/20/solid'
import { Button } from '@/ui/button'
import { useActionState } from 'react'
import { authenticate } from '@/lib/actions'
import { toast } from '@/ui/toast'
import GitHubLogin from '@/ui/login/github-login'
import GoogleLogin from '@/ui/login/google-login'
import InputError from '@/ui/input-error'
import InputErrorMessage from '@/ui/input-error-form'
import { redirect } from 'next/navigation'

type LoginState = {
  errors?: {
    email?: string[]
    password?: string[]
  }
  message?: string | null
}

export default function LoginForm() {
  const handleLogin = async (prevState: LoginState, formData: FormData) => {
    const resp = await authenticate(formData)
    if (resp.error) toast.error(resp.error)
    if (resp.success) {
      toast.success(resp.success)
      redirect('/dashboard')
    }
    return resp
  }
  const initialState: LoginState = { message: null, errors: {} }
  const [errorMessage, formAction, isPending] = useActionState(
    handleLogin,
    initialState
  )
  console.log('🚀 ~ LoginForm ~ errorMessage:', errorMessage)

  return (
    <>
      <form action={formAction} className='space-y-3'>
        <div className='flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8'>
          <h1 className={`${lusitana.className} mb-3 text-2xl`}>
            Please log in to continue.
          </h1>
          <div className='w-full'>
            <div>
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
                  type='email'
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
                  minLength={6}
                  aria-describedby='password-error'
                />
                <KeyIcon className='pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900' />
              </div>{' '}
              <InputError
                errors={errorMessage?.errors?.password}
                id='password-error'
              />
            </div>
          </div>
          <Button className='mt-4 w-full' aria-disabled={isPending}>
            Log in <ArrowRightIcon className='ml-auto h-5 w-5 text-gray-50' />
          </Button>
          <InputErrorMessage error={errorMessage?.message} id='message-error' />
          <div className='flex h-8 items-end space-x-1'></div>
        </div>
      </form>
      <div className='flex justify-between gap-3'>
        <GitHubLogin />
        <GoogleLogin />
      </div>
    </>
  )
}
