import { createContext } from 'react'

export const hydrationContext = createContext<{
  hydrated: boolean
  root: string | null
  componentName: string | null
  propsHash: string | null
}>({
  hydrated: false,
  root: null,
  componentName: null,
  propsHash: null,
})

export const HydrationContextProvider = hydrationContext.Provider
