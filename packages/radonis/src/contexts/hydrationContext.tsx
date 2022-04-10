import { createContext } from 'react';

export const hydrationContext = createContext<
  | {
      root: string;
      componentName: string;
      propsHash: string | null;
    }
  | boolean
>(false);

export const HydrationContextProvider = hydrationContext.Provider;
