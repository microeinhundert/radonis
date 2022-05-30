/*
 * @microeinhundert/radonis-form
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { useFlashMessages } from '@microeinhundert/radonis-hooks'
import type { FormEvent } from 'react'
import { useId, useState } from 'react'

import type { FormFieldInputElement, FormFieldProps } from '../types'

export function useFormField<T extends FormFieldProps>(
  name: string,
  { label, description, id, defaultValue, ...restProps }: T
) {
  const randomId = useId()
  const flashMessages = useFlashMessages()

  /**
   * Value and error states
   */
  const [value, setValue] = useState(defaultValue ?? flashMessages.get(name))
  const [error, setError] = useState(flashMessages.getError(name))

  /**
   * Touched and dirty states
   */
  const [touched, setTouched] = useState(false)
  const [dirty, setDirty] = useState(false)

  /**
   * IDs
   */
  const inputId = id ?? randomId
  const descriptionId = `description-${inputId}`
  const errorId = `error-${inputId}`

  const getInputProps = (type?: string) => ({
    ...restProps,
    name,
    type,
    'id': inputId,
    'aria-invalid': error ? 'true' : 'false',
    'aria-describedby': error ? errorId : description ? descriptionId : undefined,
    'onChange': ({ target }: FormEvent<FormFieldInputElement>) => {
      setDirty(true)
      setError('')
      setValue((target as FormFieldInputElement).value)
    },
    'onBlur': () => {
      setTouched(true)
    },
  })

  const getLabelProps = () => ({
    htmlFor: inputId,
  })

  const getDescriptionProps = () => ({
    id: descriptionId,
  })

  const getErrorProps = () => ({
    id: errorId,
  })

  return {
    name,
    label,
    description: error ? undefined : description,
    //
    value,
    setValue,
    //
    error,
    setError,
    //
    touched,
    setTouched,
    //
    dirty,
    setDirty,
    //
    getInputProps,
    getLabelProps,
    getDescriptionProps,
    getErrorProps,
  }
}
