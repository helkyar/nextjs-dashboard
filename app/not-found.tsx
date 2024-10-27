import NotFoundTemplate from '@/ui/not-found-template'

const text = `Sorry, we couldn't find the page you're looking for.`

export default function NotFound() {
  return (
    <main className='flex items-center justify-center h-[calc(100vh_/_2)]'>
      <NotFoundTemplate text={text} />
    </main>
  )
}
