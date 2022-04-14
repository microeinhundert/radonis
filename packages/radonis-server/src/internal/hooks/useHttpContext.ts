import { useRadonis } from './useRadonis'

export function useHttpContext() {
  const { ctx } = useRadonis()

  return ctx
}
