import { useRadonis } from './useRadonis'

export function useApplication() {
  const { application } = useRadonis()

  return application
}
