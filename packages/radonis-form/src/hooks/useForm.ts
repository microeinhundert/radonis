/*
 * @microeinhundert/radonis-form
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { FormEvent } from 'react'
import { useEffect, useRef } from 'react'

import type { FormOptions } from '../types'
import { useFetch } from './useFetch'

export function useForm<TData extends Record<string, any>, TError extends Record<keyof TData, string | undefined>>({
  action,
  params,
  queryParams,
  method,
  hooks,
  includeSubmitValue,
  reloadDocument,
  ...props
}: FormOptions<TData, TError>) {
  const form = useRef<HTMLFormElement | null>(null)
  const formData = useRef<FormData | null>(null)

  useEffect(() => {
    formData.current = new FormData(form.current ?? undefined)
  }, [])

  const fetch = useFetch<TData, TError>({
    action,
    params,
    queryParams,
    method,
    hooks,
    formData: formData.current ?? undefined,
  })

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
     * 2. Set abort state to `false`, if abort state is already `true`
     */
    if (!fetch.submit) {
      fetch.setSubmit(true)
      fetch.abort && fetch.setAbort(false)

      return
    }

    /**
     * When submit state is `true`,
     * 1. Set abort state to `false` to cancel current fetch request
     * 2. Set submit state to `false`, so that fetch request can be triggered again on next click
     */
    fetch.setAbort(true)
    fetch.setSubmit(false)
  }

  const getFormProps = () => ({
    ...(reloadDocument ? {} : { onSubmit: submitHandler }),
    ref: form,
    ...props,
    action: fetch.request.form.action,
    method: fetch.request.form.method,
  })

  return {
    data: fetch.data,
    error: fetch.error,
    status: fetch.status,
    transition: fetch.transition,
    abort: fetch.abortRequest,
    getFormProps,
  }
}
