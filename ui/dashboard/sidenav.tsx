import Link from 'next/link'
import NavLinks from '@/ui/dashboard/nav-links'
import AcmeLogo from '@/ui/acme-logo'
import { PowerIcon } from '@heroicons/react/24/outline'
import { signOut } from '@/auth/auth'

export default function SideNav() {
  return (
    <div className='flex h-full flex-col px-3 py-4 md:px-2'>
      <Link
        className='relative mb-2 flex items-center justify-center button p-4 h-24 bg-logo'
        href='/'
      >
        <div className='text-white md:w-40'>
          <AcmeLogo nav />
        </div>
      </Link>
      <div className='flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2'>
        <NavLinks />
        <div className='hidden h-auto w-full grow rounded-md bg-gray-50 md:block'></div>
        <form
          action={async () => {
            'use server'
            await signOut()
          }}
        >
          <button className='flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-red-100 hover:text-red-600 md:flex-none md:justify-start md:p-2 md:px-3'>
            <PowerIcon className='w-6' />
            <div className='hidden md:group-hover:block'>Sign Out</div>
          </button>
        </form>
      </div>
    </div>
  )
}
