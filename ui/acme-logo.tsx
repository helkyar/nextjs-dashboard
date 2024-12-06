import { GlobeAltIcon } from '@heroicons/react/24/outline'
import { lusitana } from '@/ui/fonts'

export default function AcmeLogo() {
  return (
    <div
      className={`${lusitana.className} flex gap-2 flex-row items-center leading-none`}
    >
      <GlobeAltIcon className='h-12 w-12 rotate-[15deg]' />
      <p className='text-[24px]'>Invoice Master</p>
    </div>
  )
}
