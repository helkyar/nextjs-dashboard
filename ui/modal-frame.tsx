import { useEffect } from 'react'

type PropTypes = {
  readonly onClose: () => void
  readonly children: React.ReactNode
}
export function ModalFrame({ onClose, children }: PropTypes) {
  useEffect(() => {
    const onEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    document.addEventListener('keydown', onEscape)
    return () => {
      document.removeEventListener('keydown', onEscape)
    }
  }, [])
  return (
    <div
      role='none'
      onClick={onClose}
      className='absolute w-full h-full backdrop-blur-sm top-0 right-0 flex justify-center items-center'
    >
      <div onClick={(e) => e.stopPropagation()}>{children}</div>
    </div>
  )
}
