/*
 * @microeinhundert/radonis-form
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { useForm } from '../hooks/useForm'
import type { FormProps } from '../types'

/**
 * Component extending the default <form> behavior
 * @see {@link https://radonis.vercel.app/docs/forms}
 */
export function Form<TData, TError>({ children, ...props }: FormProps<TData, TError>) {
  const form = useForm<TData, TError>(props)

  return (
    <form {...form.getFormProps()}>
      {typeof children === 'function'
        ? children({
            data: form.data ?? null,
            error: form.error ?? null,
            status: form.status,
          })
        : children}
    </form>
  )
}

Form.displayName = 'RadonisForm'
