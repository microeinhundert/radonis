/*
 * @microeinhundert/radonis-hooks
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { HydrationManager } from '@microeinhundert/radonis-hydrate'
import invariant from 'tiny-invariant'

export class UrlBuilder {
  /**
   * Params
   */
  private params: Record<string, any> = {}

  /**
   * Query params
   */
  private queryParams: Record<string, any> = {}

  /**
   * Constructor
   */
  constructor(private routes: Record<string, any>, private willHydrate?: boolean) {}

  /**
   * Find the route inside the list of registered routes and
   * raise exception when unable to
   */
  private findRouteOrFail(identifier: string): any {
    const route = this.routes[identifier]

    invariant(route, `Cannot find route for "${identifier}"`)

    if (this.willHydrate) {
      new HydrationManager().requireRouteForHydration(identifier)
    }

    return route
  }

  /**
   * Process the pattern with params
   */
  private processPattern(pattern: string): string {
    let url = pattern

    if (url.indexOf(':') > -1) {
      /*
       * Split pattern when route has dynamic segments
       */
      const tokens = url.split('/')

      /*
       * Lookup over the route tokens and replace them the params values
       */
      url = tokens
        .map((token) => {
          if (!token.startsWith(':')) {
            return token
          }

          const isOptional = token.endsWith('?')
          const paramName = token.replace(/^:/, '').replace(/\?$/, '')
          const param = this.params[paramName]

          /*
           * A required param is always required to make the complete URL
           */
          invariant(
            param || isOptional,
            `The "${paramName}" param is required to make the URL for the "${pattern}" route`
          )

          return param
        })
        .join('/')
    }

    return url
  }

  /**
   * Suffix the URL with the query string
   */
  private suffixQueryString(url: string): string {
    if (this.queryParams) {
      const params = new URLSearchParams()

      for (const [key, value] of Object.entries(this.queryParams)) {
        if (Array.isArray(value)) {
          value.forEach((item) => params.append(key, item))
        } else {
          params.set(key, value)
        }
      }

      const encoded = params.toString()
      url = encoded ? `${url}?${encoded}` : url
    }

    return url
  }

  /**
   * Define the params required to resolve the route
   */
  public withParams(params?: Record<string, any>): this {
    if (params) {
      this.params = params
    }

    return this
  }

  /**
   * Define the query params to suffix the URL with
   */
  public withQueryParams(queryParams?: Record<string, any>): this {
    if (queryParams) {
      this.queryParams = queryParams
    }

    return this
  }

  /**
   * Build the URL for the given route identifier
   */
  public make(identifier: string): string {
    const route = this.findRouteOrFail(identifier)
    const url = this.processPattern(route)

    return this.suffixQueryString(url)
  }
}
