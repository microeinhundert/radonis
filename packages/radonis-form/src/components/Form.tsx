/*
 * @microeinhundert/radonis-form
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { FormChildrenProps, FormOptions } from '@microeinhundert/radonis-types'
import type { FormHTMLAttributes, ReactNode } from 'react'
import React from 'react'

import { useForm } from '../hooks/useForm'

interface FormProps<TData, TError> extends FormOptions<TData, TError> {
  children: (props: FormChildrenProps<TData, TError>) => ReactNode
}

/**
 * The request headers and body will be generated based on the `encType` and `requestBody`.
 * `formData` will be serialized to appropriate `body` type based on `encType` value.
 *
 * When `requestBody` is not empty, the `Content-Type` header will be set to `application/json` and
 * `requestBody` will be used as the `body`.
 */
export function Form<TData, TError>({
  children,
  ...props
}: Omit<FormHTMLAttributes<HTMLFormElement>, 'method' | 'encType' | 'action' | 'children'> & FormProps<TData, TError>) {
  const form = useForm(props)

  return (
    <form {...form.getFormProps()}>
      {children({
        data: form.data,
        error: form.error,
        status: form.status,
        transition: form.transition,
        abort: form.abort,
      })}
    </form>
  )
}
