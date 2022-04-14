import { useAdonis } from './useAdonis';

export function useApp() {
  const { app } = useAdonis();

  return app;
}
