/*
 * @microeinhundert/radonis-form
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { RouteIdentifier, RouteParams } from '@microeinhundert/radonis-types'
import type { FormHTMLAttributes, ReactNode } from 'react'

/**
 * Headers
 */
export type Headers = Record<string, string>

/**
 * Method
 */
export type Method = 'get' | 'post' | 'put' | 'delete' | 'patch'

/**
 * Transition state
 */
export type TransitionState = 'idle' | 'submitting' | 'error' | 'catch-error'

/**
 * Transition
 */
export interface Transition {
  state: TransitionState
  formData: FormData
}

/**
 * Response with data
 */
export type ResponseWithData<TData> = Response & { data: TData }

/**
 * Hooks
 */
export type Hooks<TData, TError> = {
  /**
   * This hook is called before a fetch request is made
   */
  beforeRequest?: (init: Omit<RequestInit, 'signal'>) => void

  /**
   * This hook is called after any fetch request
   */
  afterRequest?: () => void

  /**
   * This hook is called on success
   */
  onSuccess?: (response: ResponseWithData<TData>) => void

  /**
   * This hook is called on error
   */
  onError?: (response: ResponseWithData<TError>) => void

  /**
   * This hook is called on catched error
   */
  onCatchError?: (error: any) => void

  /**
   * This hook is called after the fetch request was aborted
   */
  afterAbort?: () => void
}

/**
 * Request init options
 */
export interface RequestInitOptions {
  action: string
  method?: Method
  headers?: Headers
  formData?: FormData
}

/**
 * Fetch options
 */
export interface FetchOptions<TData, TError> {
  action: RouteIdentifier
  params?: RouteParams
  queryParams?: RouteParams
  method: Method
  headers?: Headers
  hooks?: Hooks<TData, TError>
  formData?: FormData
}

/**
 * Form options
 */
export interface FormOptions<TData, TError> extends Omit<FetchOptions<TData, TError>, 'headers' | 'formData'> {
  includeSubmitValue?: boolean
  reloadDocument?: boolean
  [key: string]: any
}

/**
 * Form props
 */
export type FormProps<TData, TError> = Omit<FormHTMLAttributes<HTMLFormElement>, 'method' | 'action' | 'children'> &
  FormOptions<TData, TError> & {
    children: ((props: FormChildrenProps<TData, TError>) => ReactNode) | ReactNode
  }

/**
 * Form children props
 */
export type FormChildrenProps<TData, TError> = {
  data: TData | null
  error: TError | null
  status: number
  transition: Transition
  abort: () => void
}
