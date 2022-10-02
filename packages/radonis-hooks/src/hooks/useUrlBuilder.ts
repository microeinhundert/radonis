/*
 * @microeinhundert/radonis-hooks
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { useHydration } from '@microeinhundert/radonis-hydrate'
import type { RouteIdentifier, RouteParams, RouteQueryParams } from '@microeinhundert/radonis-types'

import { HookException } from '../exceptions/hookException'
import { hydrationManager } from '../singletons'
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
  function findRouteOrFail(identifier: RouteIdentifier) {
    const route = routes[identifier]

    if (!route) {
      throw HookException.cannotFindRoute(identifier)
    }

    if (hydration.root) {
      hydrationManager.requireRoute(identifier)
    }

    return route
  }

  /**
   * Process pattern with params
   */
  function processPattern(pattern: string, params: RouteParams) {
    let url = pattern

    if (url.includes('*')) {
      throw HookException.wildcardRoutesNotSupported()
    }

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

          if (!paramValue && !isOptional) {
            throw HookException.missingRouteParam(paramName, pattern)
          }

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

    const encodedParams = params.toString()
    url = encodedParams ? `${url}?${encodedParams}` : url

    return url
  }

  /**
   * Make URL for given route
   */
  function make(identifier: RouteIdentifier, options?: UrlBuilderOptions) {
    const route = findRouteOrFail(identifier)

    const url = processPattern(route, options?.params ?? {})
    const urlWithQueryString = suffixQueryString(url, options?.queryParams ?? {})

    return urlWithQueryString
  }

  return {
    make,
  }
}
