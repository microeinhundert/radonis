/*
 * @microeinhundert/radonis-query
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { RouteParams, RouteQueryParams } from '@microeinhundert/radonis'
import type { UseMutationOptions, UseQueryOptions } from '@tanstack/react-query'
import type { ReactElement } from 'react'

/**
 * Server query options
 */
export interface ServerQueryOptions<TData, TError> {
  params?: RouteParams
  queryParams?: RouteQueryParams
  headers?: HeadersInit
  query?: UseQueryOptions<TData, TError>
}

/**
 * Server mutation options
 */
export interface ServerMutationOptions<TData, TError> {
  params?: RouteParams
  queryParams?: RouteQueryParams
  headers?: HeadersInit
  mutation?: UseMutationOptions<TData, TError>
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
