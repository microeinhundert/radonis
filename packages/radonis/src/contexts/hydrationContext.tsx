import { createContext } from 'react';

export const hydrationContext = createContext<{
  isInsideHydrationRoot: boolean;
  componentName: string | null;
  propsHash: string | null;
}>({
  isInsideHydrationRoot: false,
  componentName: null,
  propsHash: null,
});

export const HydrationContextProvider = hydrationContext.Provider;
