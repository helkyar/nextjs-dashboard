import NotFoundTemplate from '@/ui/not-found-template'

const text = 'Could not find the requested invoice.'

export default function NotFound() {
  return <NotFoundTemplate text={text} />
}
