'use server'

import { LoginSchema } from '@/lib/schemas'
import { signIn } from '@/auth/auth'
import { AuthError } from 'next-auth'
import { isRedirectError } from 'next/dist/client/components/redirect'
import { validateFormData } from '@/lib/schema-validation'
// import { authAccessControl } from '@/auth/auth-provider'

//FIXME-PRIO-MID: single responsibility principle error handling
//FIXME-PRIO-MID: single responsibility principle auth wrapper
//FIXME-PRIO-MID: single responsibility principle db call
//FIXME-PRIO-LOW: too many strings

export async function authenticate(formData: FormData) {
  const validatedFields = validateFormData(LoginSchema, formData)
  if (validatedFields.error) return validatedFields.error

  try {
    await signIn('credentials', formData)

    return { success: 'Logged in successfully.' }
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return { message: 'Invalid credentials.' }
        default:
          return { message: 'Something went wrong.' }
      }
    }
    if (isRedirectError(error)) throw error
    return { error: 'Data Base error. Something went wrong.' }
  }
}

export async function googleLogin() {
  await signIn('google', { callbackUrl: '/dashboard' })
}
export async function githubLogin() {
  await signIn('github', { callbackUrl: '/dashboard' })
}
export async function emailLogin(formData: FormData) {
  await signIn('resend', formData)
}
