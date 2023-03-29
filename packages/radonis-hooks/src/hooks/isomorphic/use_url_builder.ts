/*
 * @microeinhundert/radonis-hooks
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { useHydration } from '@microeinhundert/radonis-hydrate'
import { RadonisException } from '@microeinhundert/radonis-shared'
import { UrlBuilder } from '@microeinhundert/radonis-shared'
import { useMemo } from 'react'

import { E_CANNOT_FIND_ROUTE } from '../../exceptions'
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
    make$: (...args: Parameters<typeof urlBuilder.make$>) => {
      try {
        const url = urlBuilder.make$(...args)
        return url
      } catch (error) {
        if (error instanceof RadonisException && error.code === 'E_CANNOT_FIND_ROUTE') {
          throw new E_CANNOT_FIND_ROUTE([args[0]])
        }
        throw error
      }
    },
  }
}
