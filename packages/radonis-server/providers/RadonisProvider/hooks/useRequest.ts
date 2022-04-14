import { useAdonis } from './useAdonis';

export function useRequest() {
  const { request } = useAdonis();

  return request;
}
