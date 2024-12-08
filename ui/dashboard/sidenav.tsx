'use client'
import Link from 'next/link'
import NavLinks from '@/ui/dashboard/nav-links'
import AcmeLogo from '@/ui/acme-logo'
import { ChevronDoubleRightIcon, PowerIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'
import clsx from 'clsx'
import { logout } from '@/app/_lib/actions'

export default function SideNav() {
  const [open, setOpen] = useState(false)
  return (
    <div
      className={clsx(
        'w-full flex-none sticky top-0 bg-white z-10 group transition-all',
        { ['md:w-64']: open, ['md:w-16']: !open }
      )}
    >
      <div className='flex h-full flex-col px-3 py-4 md:px-2'>
        <Link
          className='relative mb-2 flex items-center justify-center button p-4 h-24 bg-logo'
          href='/'
        >
          <div className='text-white md:w-40'>
            <AcmeLogo nav isOpen={open} />
          </div>
        </Link>
        <div className='flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2'>
          <NavLinks isOpen={open} />
          <div className='hidden h-auto w-full grow rounded-md bg-gray-50 md:block'></div>
          <button
            onClick={() => setOpen((o) => !o)}
            className='hidden h-[48px] w-full md:flex grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-blue-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3'
          >
            <ChevronDoubleRightIcon
              className={clsx('w-6 transition-all', {
                ['rotate-180']: open,
              })}
            />
            <div className={clsx('hidden', { ['md:block']: open })}>
              Close menu
            </div>
          </button>
          <form action={logout}>
            <button className='flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-red-100 hover:text-red-600 md:flex-none md:justify-start md:p-2 md:px-3'>
              <PowerIcon className='w-6' />
              <div className={clsx('hidden', { ['md:block']: open })}>
                Sign Out
              </div>
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
