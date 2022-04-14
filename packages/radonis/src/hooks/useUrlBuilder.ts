import { useMemo } from 'react'

import { UrlBuilder } from '../internal/UrlBuilder'
import { useHydration } from './useHydration'
import { useRoutes } from './useRoutes'

export function useUrlBuilder() {
  const routes = useRoutes()
  const hydration = useHydration()

  return useMemo(() => new UrlBuilder(routes, !!hydration.root), [routes, hydration])
}
