import { useAdonis } from './useAdonis';

export const useApp = () => {
  const { app } = useAdonis();

  return app;
};
