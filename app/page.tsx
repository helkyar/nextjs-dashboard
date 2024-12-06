import AcmeLogo from '@/ui/acme-logo'
import { lusitana } from '@/ui/fonts'
import LoginModal from '@/ui/login/login-modal'
import Image from 'next/image'

export default function LandingPage() {
  return (
    <main className='flex flex-col p-6'>
      <div className='w-[180] absolute top-6 left-6 text-black'>
        <AcmeLogo />
      </div>
      <h1
        className={`${lusitana.className} text-[40px] font-bold pl-6 grow text-center`}
      >
        Simplify your billing process
      </h1>
      <div className='mt-4 flex grow flex-col gap-4 md:flex-row'>
        <div className='flex flex-col justify-center gap-6 rounded-lg bg-gray-50 px-2 py-10 md:w-2/5 md:px-10'>
          <LoginModal />
        </div>
        <div className='flex items-center justify-center p-6 md:w-3/5 md:px-28 md:py-12'>
          <Image
            src='/hero-desktop.png'
            width={1000}
            height={650}
            className='hidden md:block'
            alt='Screenshots of the dashboard project showing desktop version'
          />
          <Image
            src='/hero-mobile.png'
            width={560}
            height={620}
            className='block md:hidden'
            alt='Screenshots of the dashboard project showing mobile version'
          />
        </div>
      </div>
    </main>
  )
}
