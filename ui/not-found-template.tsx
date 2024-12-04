'use client'
import Link from 'next/link'
import { FaceFrownIcon } from '@heroicons/react/24/outline'
import { useRouter } from 'next/navigation'

export default function NotFoundTemplate({ text }: { readonly text: string }) {
  const { back } = useRouter()
  return (
    <main className='flex h-full flex-col items-center justify-center gap-2'>
      <FaceFrownIcon className='w-10 text-gray-400' />
      <h2 className='text-xl font-semibold'>404 Not Found</h2>
      <p>{text}</p>
      <div className='flex gap-4'>
        <Link
          onClick={back}
          href={''}
          className='mt-4 rounded-md bg-blue-500 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-400'
        >
          Go Back
        </Link>
        <Link
          href='/'
          className='mt-4 rounded-md bg-blue-500 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-400'
        >
          Go Home
        </Link>
      </div>
    </main>
  )
}
