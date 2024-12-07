import { validateToken } from '@/app/validate/_lib/actions'
import { InvalidToken, ValidationWithToast } from '@/ui/validate/validation'
import { Suspense } from 'react'

type PropTypes = {
  searchParams?: Promise<{
    token: string
  }>
}

export default async function ValidateUser(props: PropTypes) {
  const { token } = (await props.searchParams) || { token: '' }

  if (!token) return <InvalidToken />
  return (
    <Suspense fallback={<Fallback />}>
      <Validation token={token} />
    </Suspense>
  )
}

const Fallback = () => (
  <div className='w-full h-full flex items-center justify-center'>
    <h1 className='text-2xl'>Validating email...</h1>
  </div>
)

const Validation = async ({ token }: { token: string }) => {
  const response = await validateToken(token)
  if (!response) return <InvalidToken />

  return <ValidationWithToast response={response} />
}
