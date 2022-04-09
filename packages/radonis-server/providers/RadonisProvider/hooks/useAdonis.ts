import { useContext } from 'react';

import { adonisContext } from '../internal/contexts/adonisContext';

export const useAdonis = () => {
  const context = useContext(adonisContext);

  if (!context) {
    throw new Error('Cannot use Radonis server hooks on the client');
  }

  return context;
};
