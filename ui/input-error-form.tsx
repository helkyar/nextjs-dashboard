import { ExclamationCircleIcon } from '@heroicons/react/24/outline'

export default function InputErrorMessage({
  error,
  id,
}: {
  error: undefined | null | string
  id: string
}) {
  if (!error) return null
  return (
    <div
      id={id}
      aria-live='polite'
      aria-atomic='true'
      className='flex items-end gap-1'
    >
      <ExclamationCircleIcon className='h-5 w-5 text-red-500' />
      <p className='mt-2 text-sm text-red-500'>{error}</p>
    </div>
  )
}
