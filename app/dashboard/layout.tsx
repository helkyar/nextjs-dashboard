import SideNav from '@/ui/dashboard/sidenav'

// export const experimental_ppr = true

export default function Layout({
  children,
}: {
  readonly children: React.ReactNode
}) {
  return (
    <div className='flex flex-col md:flex-row md:overflow-hidden sm:h-dvh'>
      <SideNav />
      <div className='flex-grow p-6 md:overflow-y-auto'>{children}</div>
    </div>
  )
}
