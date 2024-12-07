import AcmeLogo from '@/ui/acme-logo'
import { lusitana } from '@/ui/fonts'
import LoginModal from '@/ui/login/login-modal'
import Image from 'next/image'

export default function LandingPage() {
  return (
    <main className='p-6 bg-logo h-full overflow-hidden'>
      <div className='w-[180] absolute top-6 left-6 text-black'>
        <AcmeLogo />
      </div>
      <LoginModal />
      <h1
        className={`${lusitana.className} text-white text-[40px] mt-16 font-bold text-center`}
      >
        Simplify your billing process
      </h1>
      <div className='flex items-center justify-center p-6 overflow-hidden w-full'>
        <Image
          src='/hero-desktop-final.png'
          width={1000}
          height={650}
          className='hidden md:block'
          alt='Screenshots of the dashboard project showing desktop version'
        />
        <Image
          src='/hero-mobile-final.png'
          width={560}
          height={620}
          className='block md:hidden'
          alt='Screenshots of the dashboard project showing mobile version'
        />
      </div>
    </main>
  )
}
