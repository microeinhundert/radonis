/*
 * @microeinhundert/radonis-form
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { useFlashMessages } from '@microeinhundert/radonis-hooks'
import type { InputHTMLAttributes, TextareaHTMLAttributes } from 'react'
import { useId, useState } from 'react'

/**
 * Hook for managing the state of a form field
 * @see {@link https://radonis.vercel.app/docs/guides/building-an-input-component}
 */
export function useFormField({
  name,
  label,
  description,
  id,
  defaultValue,
  ...restProps
}: (InputHTMLAttributes<HTMLInputElement> | TextareaHTMLAttributes<HTMLTextAreaElement>) & {
  name: string
  label: string
  description?: string
}) {
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

  const getInputProps = (
    overrides?: InputHTMLAttributes<HTMLInputElement> | TextareaHTMLAttributes<HTMLTextAreaElement>
  ): Record<string, unknown> => ({
    ...restProps,
    name,
    'id': inputId,
    'aria-invalid': error ? 'true' : 'false',
    'aria-describedby': error ? errorId : description ? descriptionId : undefined,
    ...overrides,
    'onChange': (event) => {
      restProps?.onChange?.(event)
      overrides?.onChange?.(event)

      if (event.defaultPrevented) return

      setDirty(true)
      setError('')
      setValue(event.target.value)
    },
    'onBlur': (event) => {
      restProps?.onBlur?.(event)
      overrides?.onBlur?.(event)

      if (event.defaultPrevented) return

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
    description,
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
