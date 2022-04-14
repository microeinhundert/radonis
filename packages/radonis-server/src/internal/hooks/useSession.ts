import { useHttpContext } from './useHttpContext'

export function useSession() {
  const { session } = useHttpContext()

  if (!session) {
    throw new Error('The provider "@adonisjs/session" is not installed')
  }

  return session
}
