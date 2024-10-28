import { githubLogin } from '@/lib/actions'

export default function GitHubLogin() {
  return (
    <form action={githubLogin}>
      <button type='submit'>Signin with GitHub</button>
    </form>
  )
}
