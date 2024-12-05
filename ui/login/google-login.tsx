import { googleLogin } from '@/app/login/_lib/actions'
import { Button } from '@/ui/button'
import Image from 'next/image'

export default function GoogleLogin({ disabled }: { disabled: boolean }) {
  return (
    <form action={googleLogin}>
      <Button
        type='submit'
        disabled={disabled}
        className='w-full justify-center flex gap-2 py-6'
      >
        <Image
          width={24}
          height={24}
          src='https://cdn-teams-slug.flaticon.com/google.jpg'
          alt='google icon'
          className='rounded-full'
        />
        Continue with Google
      </Button>
    </form>
  )
}
