/*
 * @microeinhundert/radonis-hooks
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { useHydration } from '@microeinhundert/radonis-hydrate'
import { UrlBuilder } from '@microeinhundert/radonis-shared'
import { useMemo } from 'react'

import { hydrationManager } from '../../singletons'
import { useManifest } from './use_manifest'

/**
 * Hook for building URLs to routes
 * @see https://radonis.vercel.app/docs/hooks/use-url-builder
 */
export function useUrlBuilder() {
  const { routes } = useManifest()
  const hydration = useHydration()

  const urlBuilder = useMemo(
    () =>
      new UrlBuilder(routes, {
        onFoundRoute: (identifier) => {
          if (hydration.id) {
            hydrationManager.requireRoute(identifier)
          }
        },
      }),
    [routes, hydration]
  )

  return {
    make$: (...args: Parameters<typeof urlBuilder.make>) => urlBuilder.make(...args),
  }
}
