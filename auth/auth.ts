import NextAuth, { CredentialsSignin } from 'next-auth'
import { authConfig } from './auth.config'
import Credentials from 'next-auth/providers/credentials'
import { schema } from '@/lib/schema-validation'
import type { User } from '@/lib/definitions'
import bcrypt from 'bcrypt'
import { sql } from '@/lib/db-connection'
import { redirect } from 'next/navigation'
import { LoginSchema } from '@/lib/schemas'
import GitHub from 'next-auth/providers/github'
import Google from 'next-auth/providers/google'
type Errors = { email?: string[] | undefined; password?: string[] | undefined }

class CustomErrorCredentials extends CredentialsSignin {
  errors: Errors
  message: string
  constructor(inherit: string, e: Errors, m: string) {
    super(inherit)
    this.errors = e
    this.message = m
  }
}

async function getUser(email: string): Promise<User | undefined> {
  try {
    const user = await sql<User>`SELECT * FROM users WHERE email=${email}`
    return user.rows[0]
  } catch (error) {
    console.error('Failed to fetch user:', error)
    throw new Error('Failed to fetch user.')
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Google,
    GitHub,
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = LoginSchema.safeParse(credentials)

        if (!parsedCredentials.success) {
          throw new CustomErrorCredentials(
            '',
            parsedCredentials.error.flatten().fieldErrors,
            'Missing Fields. Failed to Login.'
          )
        }
        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data
          const user = await getUser(email)
          if (!user) return null

          const passwordsMatch = await bcrypt.compare(password, user.password)
          if (passwordsMatch) return user
          // redirect('/dashboard')
        }

        return null
      },
    }),
  ],
})

// export const { signIn, signOut, auth } = NextAuth({
//   providers: [
//     Credentials({
//       credentials: {
//         username: { label: "Username" },
//         password: { label: "Password", type: "password" },
//       },
//       async authorize({ request }) {
//         const response = await fetch(request)
//         if (!response.ok) return null
//         return (await response.json()) ?? null
//       },
//     }),
//   ],
// })
