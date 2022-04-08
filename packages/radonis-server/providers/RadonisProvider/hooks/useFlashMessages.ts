import { useSession } from './useSession';

export const useFlashMessages = () => {
  const { flashMessages } = useSession();

  return flashMessages;
};
