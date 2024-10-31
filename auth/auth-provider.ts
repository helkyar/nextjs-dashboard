import { auth } from '@/auth/auth'

type Args<T extends unknown[]> = {
  [K in keyof T]: T[K]
}
export const authAccessControl = async <T, K>(
  action: (...args: Args<T[]>) => Promise<K>
) => {
  if (!(await auth())) return { error: 'Action not permitted. Invalid user' }
  return (...args: Args<T[]>) => action(...args)
}
