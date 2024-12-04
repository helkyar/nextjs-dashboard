import AcmeLogo from '@/ui/acme-logo'
import LoginForm from '@/ui/login/login-form'

export default function LoginPage() {
  return (
    <main className='flex items-center justify-center h-full'>
      <div className='relative flex w-full max-w-[400px] flex-col p-4'>
        <div className='flex h-20 w-full items-end rounded-lg bg-blue-500 p-3 md:h-36'>
          <div className='w-32 text-white md:w-36'>
            <AcmeLogo />
          </div>
        </div>
        <LoginForm />
      </div>
    </main>
  )
}
