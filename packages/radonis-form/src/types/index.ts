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
import type { MutationOptions } from 'react-query'

/**
 * Headers
 */
export type Headers = Record<string, string>

/**
 * Method
 */
export type Method = 'get' | 'post' | 'put' | 'delete' | 'patch'

/**
 * Hooks
 */
export type Hooks<TData, TError> = Pick<
  MutationOptions<TData, TError, FormData, void>,
  'onMutate' | 'onSuccess' | 'onError' | 'onSettled'
>

/**
 * Request init options
 */
export interface RequestInitOptions {
  action: string
  method?: Method
  formData: FormData | null
}

/**
 * Form options
 */
export type FormOptions<TData, TError> = {
  action: RouteIdentifier
  params?: RouteParams
  queryParams?: RouteParams
  method: Method
  hooks?: Hooks<TData, TError>
  reloadDocument?: boolean
  [key: string]: any
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
  status: 'error' | 'idle' | 'loading' | 'success'
}

/**
 * Form field value
 */
export type FormFieldValue = string | number | ReadonlyArray<string> | undefined

/**
 * Form field props
 */
export interface FormFieldProps {
  label: string
  description?: string
  id?: string
  defaultValue?: FormFieldValue
}

/**
 * Form field input element
 */
export type FormFieldInputElement = HTMLInputElement | HTMLTextAreaElement
