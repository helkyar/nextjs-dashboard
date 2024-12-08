import { inter } from '@/ui/fonts'
import '@/ui/global.css'
import { Toaster } from '@/ui/toast'
import './globals.css'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    template: '%s | Invoice Master',
    default: 'Invoice Master',
  },
  description: '',
  metadataBase: new URL('https://nextjs-dashboard-helkyar.vercel.app/'),
}

export default function RootLayout({
  children,
}: {
  readonly children: React.ReactNode
}) {
  return (
    <html lang='en'>
      <body className={`${inter.className} antialiased h-dvh`}>
        {children}
        <Toaster />
      </body>
    </html>
  )
}
