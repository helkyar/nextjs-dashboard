import { githubLogin } from '@/lib/actions'
import { Button } from '@/ui/button'
import { GithubIcon } from '@/ui/icons'

export default function GitHubLogin() {
  return (
    <form action={githubLogin}>
      <Button type='submit' className='py-6 flex gap-2 w-full justify-center'>
        <GithubIcon /> Continue with GitHub
      </Button>
    </form>
  )
}
