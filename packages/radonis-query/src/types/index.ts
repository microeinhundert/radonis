/*
 * @microeinhundert/radonis-query
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { RouteParams, RouteQueryParams } from '@microeinhundert/radonis'
import type { UseQueryOptions } from '@tanstack/react-query'
import type { ReactElement } from 'react'

/**
 * Server query options
 */
export interface ServerQueryOptions<TData, TError> {
  params?: RouteParams
  queryParams?: RouteQueryParams
  headers?: Record<string, string>
  query?: Omit<UseQueryOptions<TData, TError>, 'queryFn'>
}

/**
 * Query dehydrator props
 */
export interface QueryDehydratorProps {
  children: ReactElement
}

/**
 * Query hydrator props
 */
export interface QueryHydratorProps {
  children: ReactElement
}
