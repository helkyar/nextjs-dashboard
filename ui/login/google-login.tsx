import { googleLogin } from '@/lib/actions'
import { Button } from '@/ui/button'
import Image from 'next/image'

export default function GoogleLogin() {
  return (
    <form action={googleLogin}>
      <Button type='submit' className='flex gap-2 py-6'>
        <Image
          width={24}
          height={24}
          src='https://cdn-teams-slug.flaticon.com/google.jpg'
          alt='google icon'
          className='rounded-full'
        />
        Signin with Google
      </Button>
    </form>
  )
}
