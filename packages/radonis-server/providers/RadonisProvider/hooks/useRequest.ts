import { useAdonis } from './useAdonis';

export const useRequest = () => {
  const { request } = useAdonis();

  return request;
};
