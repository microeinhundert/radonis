import { useManifest } from './useManifest';

export const useRoute = () => {
  const { route } = useManifest();

  return {
    current: route,
    isCurrent(identifier: string): boolean {
      return route?.name === identifier;
    },
  };
};
