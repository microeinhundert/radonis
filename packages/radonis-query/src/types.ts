/*
 * @microeinhundert/radonis-query
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { RadonisContract, RouteIdentifier, RouteParams } from '@microeinhundert/radonis-types'
import type { UseQueryOptions } from '@tanstack/react-query'
import type { ReactNode } from 'react'

/**
 * Query options
 */
export interface QueryOptions<TData, TError> {
  params?: RouteParams
  queryParams?: RouteParams
  headers?: Record<string, string>
  query?: Omit<UseQueryOptions<TData, TError>, 'queryKey' | 'queryFn'>
}

/**
 * Query hydrator props
 */
export interface QueryHydratorProps {
  children: ReactNode
}

/**
 * Radonis contract with query prefetcher
 */
export interface RadonisContractWithQueryPrefetcher extends RadonisContract {
  prefetch(queries: Partial<Record<RouteIdentifier, unknown>>): RadonisContract
}
