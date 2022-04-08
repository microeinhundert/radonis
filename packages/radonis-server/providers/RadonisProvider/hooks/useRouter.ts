import { useAdonis } from './useAdonis';

export const useRouter = () => {
  const { router } = useAdonis();

  return router;
};
