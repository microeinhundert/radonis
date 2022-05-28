/*
 * @microeinhundert/radonis-form
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { FetchOptions, FormOptions } from '@microeinhundert/radonis-types'
import type { FormEvent } from 'react'
import { useEffect } from 'react'
import { useMemo, useRef } from 'react'

import { useFetch } from './useFetch'

/**
 * The request headers and body will be generated based on the `encType` and `requestBody`.
 * `formData` will be serialized to appropriate `body` type based on `encType` value.
 *
 * When `requestBody` is not empty, the `Content-Type` header will be set to `application/json` and
 * `requestBody` will be used as the `body`.
 */
export function useForm<TData, TError>({
  action,
  method,
  encType,
  headers,
  transform,
  hooks,
  includeSubmitValue,
}: FormOptions<TData, TError>) {
  /**
   * The form ref
   */
  const form = useRef<HTMLFormElement | null>(null)

  /**
   * The form data
   */
  const formData = useRef<FormData | null>(null)

  useEffect(() => {
    formData.current = new FormData(form.current || undefined)
  }, [])

  /**
   * The memoized fetch options
   */
  const fetchOptions = useMemo<FetchOptions<TData, TError>>(
    () => ({
      action,
      method,
      encType: encType || 'application/x-www-form-urlencoded',
      headers,
      transform,
      hooks,
      formData: formData.current || undefined,
    }),
    [action, method, encType, headers, transform, hooks]
  )

  const { request, submit, setSubmit, abort, setAbort, data, error, status, transition, abortRequest } = useFetch<
    TData,
    TError
  >(fetchOptions)

  /** submit handler */
  function submitHandler(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    /**
     * 1. Get submit button value
     * 2. Update formData value
     * 3. Remove previous formData submitter value
     * 4. Update formData submitter value if it exists
     */
    const submitter = (event.nativeEvent as any).submitter as HTMLButtonElement
    formData.current = new FormData(event.currentTarget)
    if (includeSubmitValue && submitter.hasAttribute('name') && submitter.hasAttribute('value')) {
      formData.current.delete(submitter.name)
      formData.current.append(submitter.name, submitter.value)
    }

    /**
     * When submit state is `false`,
     * 1. Set submit state to `true` to trigger fetch request
     * 2. Set abort state to `false`, if abort state is already `true`.
     */
    if (!submit) {
      setSubmit(true)
      abort && setAbort(false)

      return
    }

    /**
     * When submit state is `true`,
     * 1. Set abort state to `false` to cancel current fetch request
     * 2. Set submit state to `false`, so that fetch request can be trigger again on next click.
     */
    setAbort(true)
    setSubmit(false)
  }

  const getFormProps = () => ({
    ref: form,
    action: request.formUrl,
    method: request.method as string,
    encType: request.encType as string,
    onSubmit: submitHandler,
  })

  return {
    data,
    error,
    status,
    transition,
    abort: abortRequest,
    getFormProps,
  }
}
