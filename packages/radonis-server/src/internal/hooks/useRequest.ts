import { useHttpContext } from './useHttpContext'

export function useRequest() {
  const { request } = useHttpContext()

  return request
}
