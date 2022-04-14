import { useContext } from 'react';

import { manifestBuilderContext } from '../contexts/manifestBuilderContext';

export function useManifestBuilder() {
  const context = useContext(manifestBuilderContext);

  return context;
}
