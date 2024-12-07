'use client'
import { cx } from '@/lib/utils'
import { ChevronDoubleRightIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'

export function NavWrapper({
  children,
}: {
  readonly children: React.ReactNode
}) {
  const [open, setOpen] = useState(true)
  return (
    <div
      className={cx(
        'w-full flex-none sticky top-0 bg-white z-10 group transition-all',
        { ['md:w-64']: open, ['md:w-20']: !open }
      )}
    >
      <button onClick={() => setOpen((o) => !o)}>
        <ChevronDoubleRightIcon />
      </button>
      {children}
    </div>
  )
}
