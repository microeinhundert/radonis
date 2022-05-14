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

import { UrlBuilderImpl } from '../internal/UrlBuilder'
import { useManifest } from './useManifest'

export function useUrlBuilder() {
  const { routes } = useManifest()
  const hydration = useHydration()

  return useMemo(() => new UrlBuilderImpl(routes, !!hydration.root), [routes, hydration])
}
