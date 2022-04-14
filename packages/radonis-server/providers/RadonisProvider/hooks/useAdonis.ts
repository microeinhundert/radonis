import { useContext } from 'react';

import { adonisContext } from '../internal/contexts/adonisContext';

export function useAdonis() {
  const context = useContext(adonisContext);

  if (!context) {
    throw new Error(
      `You cannot use hooks from the "radonis-server" package on the client.
      Please make sure to only use hooks from the main "radonis" package inside of client-side hydrated components`
    );
  }

  return context;
}
