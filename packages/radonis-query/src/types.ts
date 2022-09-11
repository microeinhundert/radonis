/*
 * @microeinhundert/radonis-query
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { RouteParams } from '@microeinhundert/radonis-types'
import type { QueryClient } from '@tanstack/react-query'

/**
 * Fetcher options
 */
export interface FetcherOptions {
  params?: RouteParams
  queryParams?: RouteParams
  headers?: Record<string, string>
}

/**
 * URL factory params
 */
export type UrlFactoryParams = {
  routeIdentifier: string
  params?: RouteParams
  queryParams: RouteParams
}

/**
 * URL factory
 */
export type UrlFactory = (this: QueryClient, params: UrlFactoryParams) => string
