import SideNav from '@/ui/dashboard/sidenav'

// export const experimental_ppr = true

export default function Layout({
  children,
}: {
  readonly children: React.ReactNode
}) {
  return (
    <div className='flex flex-col md:flex-row md:overflow-hidden sm:h-dvh'>
      <div className='w-full flex-none sticky top-0 bg-white z-10  md:w-20 group md:hover:w-64 transition-all'>
        <SideNav />
      </div>
      <div className='flex-grow p-6 md:overflow-y-auto'>{children}</div>
    </div>
  )
}
