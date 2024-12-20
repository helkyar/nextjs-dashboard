'use client'
import Link from 'next/link'
import { FaceFrownIcon } from '@heroicons/react/24/outline'
import { useRouter } from 'next/navigation'
import { Button } from '@/ui/button'

export default function NotFoundTemplate({ text }: { readonly text: string }) {
  const { back } = useRouter()
  return (
    <main className='flex h-full flex-col items-center justify-center gap-2'>
      <FaceFrownIcon className='w-10 text-gray-400' />
      <h2 className='text-xl font-semibold'>404 Not Found</h2>
      <p>{text}</p>
      <div className='flex gap-4'>
        <Button onClick={back} className='mt-4'>
          Go Back
        </Button>
        <Link href='/' className='mt-4 button'>
          Go Home
        </Link>
      </div>
    </main>
  )
}
