/*
 * @microeinhundert/radonis-form
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { MutationHooks, MutationStatus } from '@microeinhundert/radonis-hooks'
import type { RouteParams, RouteQueryParams } from '@microeinhundert/radonis-types'
import type { FormHTMLAttributes, ReactNode } from 'react'

/**
 * Form method
 */
export type FormMethod = 'get' | 'post' | 'put' | 'delete' | 'patch'

/**
 * Form hooks
 */
export type FormHooks<TData, TError> = MutationHooks<FormData, TData, TError>

/**
 * Form options
 */
export interface FormOptions<TData, TError> {
  action: string
  params?: RouteParams
  queryParams?: RouteQueryParams
  method: FormMethod
  hooks?: FormHooks<TData, TError>
  noReload?: boolean
  throwOnFailure?: boolean
  useErrorBoundary?: boolean
  [key: string]: unknown
}

/**
 * Form props
 */
export type FormProps<TData, TError> = Omit<FormHTMLAttributes<HTMLFormElement>, 'children' | 'action' | 'method'> &
  FormOptions<TData, TError> & {
    children?: ((props: FormChildrenProps<TData, TError>) => ReactNode) | ReactNode
  }

/**
 * Form children props
 */
export type FormChildrenProps<TData, TError> = {
  data: TData | null
  error: TError | null
  status: MutationStatus
}
