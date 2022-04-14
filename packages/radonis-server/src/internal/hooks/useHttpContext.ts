import { useRadonis } from './useRadonis'

export function useHttpContext() {
  const { httpContext } = useRadonis()

  return httpContext
}
