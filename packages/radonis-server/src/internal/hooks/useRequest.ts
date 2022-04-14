import { useRadonis } from './useRadonis'

export function useRequest() {
  const { request } = useRadonis()

  return request
}
