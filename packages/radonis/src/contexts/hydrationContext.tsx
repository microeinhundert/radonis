import { createContext } from 'react';

export const hydrationContext = createContext<{
  isChildOfHydrationRoot: boolean;
  hydration: {
    componentName: string | null;
    propsHash: string | null;
  };
}>({
  isChildOfHydrationRoot: false,
  hydration: {
    componentName: null,
    propsHash: null,
  },
});

export const HydrationContextProvider = hydrationContext.Provider;
