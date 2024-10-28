import { googleLogin } from '@/lib/actions'

export default function GoogleLogin() {
  return (
    <form action={googleLogin}>
      <button type='submit'>Signin with Google</button>
    </form>
  )
}
