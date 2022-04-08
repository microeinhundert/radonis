import { createContext } from 'react';

import type { ManifestBuilder } from '../ManifestBuilder';

export const manifestBuilderContext = createContext<ManifestBuilder>(null as any);

export const ManifestBuilderContextProvider = manifestBuilderContext.Provider;
