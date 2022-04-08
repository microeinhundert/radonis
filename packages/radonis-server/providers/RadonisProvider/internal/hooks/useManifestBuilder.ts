import { useContext } from 'react';

import { manifestBuilderContext } from '../contexts/manifestBuilderContext';

export const useManifestBuilder = () => {
  const context = useContext(manifestBuilderContext);

  return context;
};
