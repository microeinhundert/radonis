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

type FormProps<TData, TError> = Omit<FormHTMLAttributes<HTMLFormElement>, 'method' | 'action' | 'children'> &
  FormOptions<TData, TError> & {
    children: (props: FormChildrenProps<TData, TError>) => ReactNode
  }

export function Form<TData, TError>({ children, ...props }: FormProps<TData, TError>) {
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
