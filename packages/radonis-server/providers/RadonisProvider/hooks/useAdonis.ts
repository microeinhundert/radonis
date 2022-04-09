import { useContext } from 'react';

import { adonisContext } from '../internal/contexts/adonisContext';

export const useAdonis = () => {
  const context = useContext(adonisContext);

  if (!context) {
    throw new Error(
      'Cannot use hooks from the "radonis-server" package on the client. Please make sure you only use hooks from the main "radonis" package on the client'
    );
  }

  return context;
};
