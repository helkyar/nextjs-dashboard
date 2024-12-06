'use client'

import { Button } from '@/ui/button'
import { useEffect } from 'react'

export default function ErrorPage({
  error,
  reset,
}: {
  readonly error: Error & { digest?: string }
  readonly reset: () => void
}) {
  useEffect(() => {
    // Optionally log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <main className='flex h-full flex-col items-center justify-center'>
      <h2 className='text-center'>Something went wrong!</h2>
      <Button
        className='mt-4'
        onClick={
          // Attempt to recover by trying to re-render the invoices route
          () => reset()
        }
      >
        Try again
      </Button>
    </main>
  )
}
