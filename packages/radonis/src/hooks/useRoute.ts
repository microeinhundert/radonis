import { useManifest } from '../internal/hooks/useManifest';

export const useRoute = () => {
  const { route } = useManifest();

  return {
    current: route,
    isCurrent: (identifier: string): boolean => route?.name === identifier,
  };
};
