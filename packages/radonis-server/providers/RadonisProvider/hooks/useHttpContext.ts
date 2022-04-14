import { useAdonis } from './useAdonis';

export function useHttpContext() {
  const { ctx } = useAdonis();

  return ctx;
}
