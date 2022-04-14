import { useRadonis } from './useRadonis'

export function useRouter() {
  const { router } = useRadonis()

  return router
}
