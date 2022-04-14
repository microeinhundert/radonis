import { useContext } from 'react'

import { hydrationContext } from '../contexts/hydrationContext'

export function useHydration() {
  const context = useContext(hydrationContext)

  return context
}
