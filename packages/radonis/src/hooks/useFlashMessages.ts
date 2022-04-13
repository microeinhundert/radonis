import { FlashMessages } from '../internal/FlashMessages';
import { useHydration } from './useHydration';
import { useManifest } from './useManifest';

export const useFlashMessages = () => {
  const { flashMessages } = useManifest();
  const hydration = useHydration();

  return new FlashMessages(flashMessages, !!hydration.root);
};
