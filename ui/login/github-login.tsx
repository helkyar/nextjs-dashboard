import { githubLogin } from '@/lib/actions'
import { Button } from '@/ui/button'
import { GithubIcon } from '@/ui/icons'

export default function GitHubLogin() {
  return (
    <form action={githubLogin}>
      <Button type='submit' className='py-6'>
        <GithubIcon /> Signin with GitHub
      </Button>
    </form>
  )
}
