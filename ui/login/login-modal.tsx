'use client'
import AcmeLogo from '@/ui/acme-logo'
import { Button } from '@/ui/button'
import LoginForm from '@/ui/login/login-form'
import { ModalFrame } from '@/ui/modal-frame'
import { ArrowRightIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'

export default function LoginModal() {
  const [showModal, setShowModal] = useState(false)

  return (
    <>
      <div className='absolute top-6 right-6 flex gap-2'>
        <Button
          onClick={() => setShowModal(true)}
          className='bg-transparent border border-[skyblue]'
        >
          <span className='font-bold'>Log in</span>
        </Button>
        <Button
          onClick={() => {}}
          className='flex items-center gap-5 self-start'
        >
          <span className='font-bold'>Register</span>
          <ArrowRightIcon className='w-5 md:w-6' />
        </Button>
      </div>
      {showModal && (
        <ModalFrame onClose={() => setShowModal(false)}>
          <div className='flex gap-2 w-full max-w-[400px] flex-col p-4 rounded-lg shadow-xl bg-gray-100'>
            <div className='flex w-full rounded-lg bg-logo p-3 h-20 items-center justify-center'>
              <AcmeLogo />
            </div>
            <LoginForm />
          </div>
        </ModalFrame>
      )}
    </>
  )
}
