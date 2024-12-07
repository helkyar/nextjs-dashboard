'use client'

import { toast } from '@/ui/toast'
import { redirect } from 'next/navigation'

export function ValidationWithToast({
  response,
}: {
  response: { error?: string; success?: string }
}) {
  if (response.error) {
    toast.error(response.error)
    return <InvalidToken />
  }
  if (response.success) {
    toast.success(response.success)
    setTimeout(() => redirect('/'), 1000)
  }
  return (
    <div className='w-full h-full flex items-center justify-center'>
      <h1 className='text-2xl'>Email validated</h1>
    </div>
  )
}

export const InvalidToken = () => (
  <div className='w-full h-full flex items-center justify-center'>
    <h1 className='text-2xl'>Invalid token</h1>
  </div>
)
