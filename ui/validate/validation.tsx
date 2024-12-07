'use client'
import { InvalidToken } from '@/app/validate/page'
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
    redirect('/')
  }
  return (
    <div className='w-full h-full flex items-center justify-center'>
      <h1 className='text-2xl'>Email validated</h1>
    </div>
  )
}
