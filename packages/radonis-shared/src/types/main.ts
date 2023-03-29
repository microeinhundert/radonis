/*
 * @microeinhundert/radonis-shared
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { RouteParams, RouteQueryParams } from '@microeinhundert/radonis-types'

/**
 * URL builder options
 */
export interface UrlBuilderOptions {
  onFoundRoute: (routeIdentifier: string) => void
}

/**
 * URL builder make options
 */
export interface UrlBuilderMakeOptions {
  baseUrl?: string
  params?: RouteParams
  queryParams?: RouteQueryParams
}
