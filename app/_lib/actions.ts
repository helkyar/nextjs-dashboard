'use server'

import { LoginSchema, RegisterSchema } from '@/app/_lib/schemas'
import { signIn, signOut } from '@/auth/auth'
import { AuthError } from 'next-auth'
import { isRedirectError } from 'next/dist/client/components/redirect'
import { validateFormData } from '@/lib/schema-validation'
import { sql } from '@/lib/db-connection'
import { randomUUID } from 'crypto'
import bcrypt from 'bcrypt'
import { getResent } from '@/app/_lib/get-resend'
import { html } from '@/app/_lib/template-email'

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
type ExtendedLoginState = LoginState & { success?: string; error?: string }

export async function authenticate(
  formData: FormData
): Promise<ExtendedLoginState> {
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

export type RegisterState = {
  errors?: {
    username?: string[]
    email?: string[]
    password?: string[]
    passwordConfirmation?: string[]
  }
  message?: string | null
}
type ExtendedRegisterState = RegisterState & {
  success?: string
  error?: string
}

export async function register(
  formData: FormData
): Promise<ExtendedRegisterState> {
  const validatedFields = validateFormData(RegisterSchema, formData)
  if (validatedFields.error) return validatedFields.error
  const { email, password, username } = validatedFields.data
  const hashedPassword = await bcrypt.hash(password, 10)

  const token = await bcrypt.hash(randomUUID(), 10)

  sendValidationEmail(token, email)

  try {
    const uniqueUser = await sql`SELECT email FROM users WHERE email = ${email}`

    if (uniqueUser.rows.length > 0) {
      return { success: 'Register successful. Validate your Email to continue' }
    }
    await sql`
      INSERT INTO users (id, name, email, password, token)
      VALUES (${randomUUID()},${username}, ${email}, ${hashedPassword}, ${token})
    `
    return { success: 'Register successful. Validate your Email to continue' }
  } catch {
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

export async function logout() {
  await signOut()
}

async function sendValidationEmail(token: string, email: string) {
  try {
    const { resend, business, personal } = getResent()
    const url = `${process.env.NEXT_PUBLIC_URL}/validate?token=${token}`

    const { data, error } = await resend.emails.send({
      from: business,
      to: [email],
      bcc: [personal],
      subject: 'Validate email',
      text: `Sing in to Invoice Master ${url}`,
      html: html({ url }),
    })

    if (!data || error) throw new Error('Failed to send email')
    return { success: true }
  } catch (error) {
    return { error }
  }
}
