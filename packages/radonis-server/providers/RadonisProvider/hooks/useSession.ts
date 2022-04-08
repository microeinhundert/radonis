import { useHttpContext } from './useHttpContext';

export const useSession = () => {
  const { session } = useHttpContext();

  if (!session) {
    throw new Error('The provider "@adonisjs/session" is not installed');
  }

  return session;
};
