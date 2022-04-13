import { useEffect, useState } from 'react';

import { useHydration } from './useHydration';

export const useHydrated = () => {
  const hydration = useHydration();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(hydration.hydrated);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return hydrated;
};
