/*
 * @microeinhundert/radonis-hooks
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { HydrationManager, useHydration } from '@microeinhundert/radonis-hydrate'
import { invariant } from '@microeinhundert/radonis-shared'
import type { AvailableRoutes, RouteParams, RouteQueryParams } from '@microeinhundert/radonis-types'

import type { UrlBuilderOptions } from '../types'
import { useManifest } from './useManifest'

/**
 * Hook for building URLs to routes
 * @see https://radonis.vercel.app/docs/hooks/use-url-builder
 */
export function useUrlBuilder() {
  const { routes } = useManifest()
  const hydration = useHydration()

  /**
   * Find the route inside the registered routes and
   * raise exception when unable to
   */
  function findRouteOrFail(identifier: AvailableRoutes['value']) {
    const route = routes[identifier]

    invariant(route, `Cannot find route for "${identifier}"`)

    if (hydration.root) {
      HydrationManager.getInstance().requireRouteForHydration(identifier)
    }

    return route
  }

  /**
   * Process pattern with params
   */
  function processPattern(pattern: string, params: RouteParams) {
    let url = pattern

    invariant(!url.includes('*'), 'Wildcard routes are currently not supported')

    if (url.includes(':')) {
      /*
       * Split pattern when route has dynamic segments
       */
      const tokens = url.split('/')

      /*
       * Replace tokens with values
       */
      url = tokens
        .map((token) => {
          if (!token.startsWith(':')) {
            return token
          }

          const isOptional = token.endsWith('?')
          const paramName = token.replace(/^:/, '').replace(/\?$/, '')
          const paramValue = params[paramName]

          invariant(
            paramValue || isOptional,
            `The "${paramName}" param is required to make the URL for the "${pattern}" route`
          )

          return paramValue
        })
        .filter(Boolean)
        .join('/')
    }

    if (!url.startsWith('/')) {
      url = `/${url}`
    }

    return url
  }

  /**
   * Suffix URL with query string
   */
  function suffixQueryString(url: string, queryParams: RouteQueryParams) {
    const params = new URLSearchParams()

    for (const [key, value] of Object.entries(queryParams)) {
      if (Array.isArray(value)) {
        value.forEach((item) => params.append(key, item.toString()))
      } else {
        params.set(key, value.toString())
      }
    }

    const encoded = params.toString()
    url = encoded ? `${url}?${encoded}` : url

    return url
  }

  /**
   * Make URL for given route
   */
  function make(identifier: AvailableRoutes['value'], options?: UrlBuilderOptions) {
    const route = findRouteOrFail(identifier)

    const url = processPattern(route, options?.params ?? {})
    const urlWithQueryString = suffixQueryString(url, options?.queryParams ?? {})

    return urlWithQueryString
  }

  return {
    make,
  }
}
