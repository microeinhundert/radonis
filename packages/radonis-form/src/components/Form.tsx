/*
 * @microeinhundert/radonis-form
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import React from 'react'

import { useForm } from '../hooks/useForm'
import type { FormProps } from '../types'

export function Form<
  TData extends Record<string, any>,
  TError extends Record<string, any> = Record<keyof TData, string | undefined>
>({ children, ...props }: FormProps<TData, TError>) {
  const form = useForm(props)

  return (
    <form {...form.getFormProps()}>
      {typeof children === 'function'
        ? children({
            data: form.data,
            error: form.error,
            status: form.status,
            transition: form.transition,
            abort: form.abort,
          })
        : children}
    </form>
  )
}
