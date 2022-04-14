import { useMemo } from 'react';

import { FlashMessages } from '../internal/FlashMessages';
import { useHydration } from './useHydration';
import { useManifest } from './useManifest';

export const useFlashMessages = () => {
  const { flashMessages } = useManifest();
  const hydration = useHydration();

  return useMemo(
    () => new FlashMessages(flashMessages, !!hydration.root),
    [flashMessages, hydration]
  );
};
