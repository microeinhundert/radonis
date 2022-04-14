import { useAdonis } from './useAdonis';

export function useRouter() {
  const { router } = useAdonis();

  return router;
}
