import { Resend } from 'resend'

export const getResent = () => {
  const resend = new Resend(process.env.RESEND_API_KEY)
  const personal = process.env.ADMIN_EMAIL as string
  const business = process.env.BUSINESS_EMAIL as string
  return { resend, personal, business }
}
