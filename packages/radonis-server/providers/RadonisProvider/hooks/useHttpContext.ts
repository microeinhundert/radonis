import { useAdonis } from './useAdonis';

export const useHttpContext = () => {
  const { ctx } = useAdonis();

  return ctx;
};
