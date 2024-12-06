'use client'
import AcmeLogo from '@/ui/acme-logo'
import LoginForm from '@/ui/login/login-form'
import { ModalFrame } from '@/ui/modal-frame'
import { ArrowRightIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'

export default function LoginModal() {
  const [showModal, setShowModal] = useState(false)

  return (
    <main className='flex items-center justify-center h-full'>
      <button
        onClick={() => setShowModal(true)}
        className='flex items-center gap-5 self-start rounded-lg bg-blue-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-400 md:text-base'
      >
        <span>Log in</span> <ArrowRightIcon className='w-5 md:w-6' />
      </button>
      {showModal && (
        <ModalFrame onClose={() => setShowModal(false)}>
          <div className='flex w-full max-w-[400px] flex-col p-4 bg-white rounded-lg shadow-lg'>
            <div className='flex h-20 w-full items-end rounded-lg bg-blue-500 p-3 md:h-36'>
              <div className='w-32 text-white md:w-36'>
                <AcmeLogo />
              </div>
            </div>
            <LoginForm />
          </div>
        </ModalFrame>
      )}
    </main>
  )
}
