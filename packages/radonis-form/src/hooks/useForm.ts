/*
 * @microeinhundert/radonis-form
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { useUrlBuilder } from '@microeinhundert/radonis-hooks'
import { HydrationManager, useHydration } from '@microeinhundert/radonis-hydrate'
import type { FormEvent } from 'react'
import { useEffect, useMemo, useRef } from 'react'
import { useMutation } from 'react-query'

import type { FormOptions } from '../types'
import { createRequestInit } from '../utils/createRequestInit'

export function useForm<TData = unknown, TError = unknown>({
  action,
  params,
  queryParams,
  method,
  hooks,
  reloadDocument,
  ...props
}: FormOptions<TData, TError>) {
  const urlBuilder = useUrlBuilder()
  const hydration = useHydration()

  const form = useRef<HTMLFormElement | null>(null)
  const formData = useRef<FormData | null>(null)

  if (hydration.root) {
    HydrationManager.getInstance().requireRouteForHydration(action)
  }

  useEffect(() => {
    if (form.current) {
      formData.current = new FormData(form.current)
    }
  }, [form])

  /**
   * The memoized request init
   */
  const request = useMemo(() => {
    urlBuilder.withParams(params)
    urlBuilder.withQueryParams(queryParams)

    return createRequestInit({
      action: urlBuilder.make(action),
      method,
      formData: formData.current,
    })
  }, [urlBuilder, action, params, queryParams, method, formData])

  /**
   * The mutation
   */
  const mutation = useMutation<TData, TError, FormData>({
    mutationKey: ['form', action, method, params, queryParams],
    mutationFn: async () => {
      const response = await fetch(request.requestUrl, request.requestInit)

      return response.json()
    },
    ...(hooks ?? {}),
  })

  /**
   * The submit handler
   */
  function submitHandler(event: FormEvent<HTMLFormElement>) {
    if (event.defaultPrevented) return

    event.preventDefault()

    if (!formData.current) {
      return
    }

    mutation.mutate(formData.current)
  }

  /**
   * The form props getter
   */
  const getFormProps = () => ({
    onSubmit: reloadDocument ? undefined : submitHandler,
    ref: form,
    ...props,
    action: request.form.action,
    method: request.form.method,
  })

  return {
    data: mutation.data,
    error: mutation.error,
    status: mutation.status,
    getFormProps,
  }
}
