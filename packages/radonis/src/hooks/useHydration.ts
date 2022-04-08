import { useContext } from 'react';

import { hydrationContext } from '../contexts/hydrationContext';

export const useHydration = () => {
  const context = useContext(hydrationContext);

  return context;
};
