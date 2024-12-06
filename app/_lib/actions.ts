'use server'

import { LoginSchema } from '@/app/_lib/schemas'
import { signIn } from '@/auth/auth'
import { AuthError } from 'next-auth'
import { isRedirectError } from 'next/dist/client/components/redirect'
import { validateFormData } from '@/lib/schema-validation'

//FIXME-PRIO-MID: single responsibility principle error handling
//FIXME-PRIO-MID: single responsibility principle auth wrapper
//FIXME-PRIO-MID: single responsibility principle db call
//FIXME-PRIO-LOW: too many strings

export type LoginState = {
  errors?: {
    email?: string[]
    password?: string[]
  }
  message?: string | null
}
type ExtendedState = LoginState & { success?: string; error?: string }

export async function authenticate(formData: FormData): Promise<ExtendedState> {
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
