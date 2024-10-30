import { auth } from '@/auth/auth'

export const isUserLogged = async () => {
  if (!(await auth())) throw new Error('User not found')
  // if (!(await session())) redirect('/login')
}
