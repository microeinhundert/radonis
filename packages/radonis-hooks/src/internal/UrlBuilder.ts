/*
 * @microeinhundert/radonis-hooks
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { HydrationManager } from '@microeinhundert/radonis-hydrate'

export class UrlBuilder {
  /**
   * Params
   */
  private params: any[] | Record<string, any>

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

    if (!route) {
      throw new Error(`Cannot find route for "${identifier}"`)
    }

    if (this.willHydrate) {
      new HydrationManager().requireRouteForHydration(identifier)
    }

    return route
  }

  /**
   * Process the pattern with params
   */
  private processPattern(pattern: string): string {
    let url: string[] = []
    const isParamsAnArray = Array.isArray(this.params)

    /*
     * Split pattern when route has dynamic segments
     */
    const tokens = pattern.split('/')
    let paramsIndex = 0

    for (const token of tokens) {
      /**
       * Expected wildcard param to be at the end always and hence
       * we must break out from the loop
       */
      if (token === '*') {
        const wildcardParams = isParamsAnArray ? this.params.slice(paramsIndex) : this.params['*']

        if (!Array.isArray(wildcardParams)) {
          throw new Error('Wildcard param must pass an array of values')
        }

        if (!wildcardParams.length) {
          throw new Error(`Wildcard param is required to make URL for "${pattern}" route`)
        }

        url = url.concat(wildcardParams)
        break
      }

      /**
       * Token is a static value
       */
      if (!token.startsWith(':')) {
        url.push(token)
      } else {
        const isOptional = token.endsWith('?')
        const paramName = token.replace(/^:/, '').replace(/\?$/, '')
        const param = isParamsAnArray ? this.params[paramsIndex] : this.params[paramName]

        paramsIndex++

        /*
         * A required param is always required to make the complete URL
         */
        if (!param && !isOptional) {
          throw new Error(`"${param}" param is required to make URL for "${pattern}" route`)
        }

        url.push(param)
      }
    }

    return url.join('/')
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
  public withParams(params?: any[] | Record<string, any>): this {
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
