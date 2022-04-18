/*
 * @microeinhundert/radonis-hooks
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { useHydration } from '@microeinhundert/radonis-hydrate'
import { useMemo } from 'react'

import { UrlBuilder } from '../internal/UrlBuilder'
import { useRoutes } from './useRoutes'

export function useUrlBuilder() {
  const routes = useRoutes()
  const hydration = useHydration()

  return useMemo(() => new UrlBuilder(routes, !!hydration.root), [routes, hydration])
}
