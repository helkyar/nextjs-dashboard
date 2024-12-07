import { sql } from '@/lib/db-connection'
import { User } from '@/lib/definitions'

export async function validateToken(token: string) {
  try {
    const userMatch =
      await sql<User>`SELECT verified, created_at FROM users WHERE token = ${token}`
    const user = userMatch.rows[0]
    console.log('🚀 ~ validateToken ~ userMatch:', userMatch)
    console.log('🚀 ~ validateToken ~ user:', user)

    if (!user) return { error: 'Invalid token' }

    if (!user.verified && new Date(user.created_at) > new Date()) {
      console.log('🚀 ~ validateToken ~ token expired')
      await sql`DELETE FROM users WHERE token = ${token}`
      return { error: 'User deleted due to invalid validation status' }
    }

    await sql`UPDATE users SET token = NULL, verified = true WHERE token = ${token}`
    return { success: 'Email validated' }
  } catch (error) {
    console.error('Failed to validate token:', error)
    return { error: 'Database error' }
  }
}
