/* eslint-disable @typescript-eslint/no-shadow */

/*
 * @microeinhundert/radonis-form
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { useUrlBuilder } from '@microeinhundert/radonis-hooks'
import { useEffect, useMemo, useRef, useState } from 'react'

import type { FetchOptions, ResponseWithData, Transition, TransitionState } from '../types'
import { createRequestInit } from '../utils/createRequestInit'

export function useFetch<TData extends Record<string, any>, TError extends Record<keyof TData, string | undefined>>({
  action,
  params,
  queryParams,
  method,
  headers,
  hooks,
  formData,
}: FetchOptions<TData, TError>) {
  const isFirstRender = useRef(true)
  const urlBuilder = useUrlBuilder()

  /**
   * Submit and abort states
   */
  const [submit, setSubmit] = useState(false)
  const [abort, setAbort] = useState(false)

  /**
   * Fetch request states
   */
  const [status, setStatus] = useState(0)
  const [data, setData] = useState<TData | null>(null)
  const [error, setError] = useState<TError | null>(null)
  const [transitionState, setTransitionState] = useState<TransitionState>('idle')

  const request = useMemo(() => {
    urlBuilder.withParams(params)
    urlBuilder.withQueryParams(queryParams)

    return createRequestInit({
      action: urlBuilder.make(action),
      method,
      headers,
      formData,
    })
  }, [urlBuilder, action, params, queryParams, method, headers, formData])

  useEffect(() => {
    const controller = new AbortController()
    const signal = controller.signal

    async function executeFetch() {
      try {
        const response = await fetch(request.url, {
          ...request.requestInit,
          signal,
        })

        if (response.redirected) {
          window.location.href = response.url
        }

        const responseWithData: ResponseWithData<TData> = {
          ...response,
          data: await response.json(),
        }

        setStatus(responseWithData.status)

        if (responseWithData.ok) {
          if (hooks?.onSuccess) {
            /**
             * Call the `onSuccess` hook
             */
            hooks.onSuccess(responseWithData)
          }

          setData(responseWithData.data)
          setTransitionState('idle')

          return
        }

        if (hooks?.onError) {
          /**
           * Call the `onError` hook
           */
          hooks.onError({
            ...response,
            data: (responseWithData.data as any).data as TError,
          })
        }

        setError((responseWithData.data as any).data as TError)
        setTransitionState('error')
      } catch (error) {
        if (hooks?.onCatchError) {
          /**
           * Call the `onCatchError` hook
           */
          hooks.onCatchError(error)
        }

        setTransitionState('catch-error')
      }

      if (hooks?.afterRequest) {
        /**
         * Call the `afterRequest` hook
         */
        hooks.afterRequest()
      }
    }

    /**
     * 1. Prevent fetching on first render with useRef
     * 2. Fetch request when submit is `true`
     * 3. Or re-fetch request when abort is `true` (which simulates continuous clicking of the submit button)
     */
    if (!isFirstRender.current && (submit || abort)) {
      /**
       * Reset states before submitting
       */
      setStatus(0)
      setData(null)
      setError(null)
      setTransitionState('idle')

      /**
       * Call the `beforeRequest` hook
       */
      if (hooks?.beforeRequest) {
        hooks.beforeRequest(request.requestInit)
      }

      setTransitionState('submitting')
      executeFetch()
    }

    /**
     * Abort fetch request on every `submit` and `abort` state change
     */
    return () => {
      controller.abort()

      /**
       * Call the `afterAbort` hook
       */
      if (hooks?.afterAbort) {
        hooks.afterAbort()
      }

      setTransitionState('idle')
    }
  }, [request, abort, hooks, submit])

  /**
   * Change the first render state to `false` after the first render
   */
  if (isFirstRender.current) {
    isFirstRender.current = false
  }

  /**
   * Abort the fetch request
   */
  function abortRequest() {
    setSubmit(false)
    setAbort(false)
  }

  return {
    request,
    submit,
    setSubmit,
    abort,
    setAbort,
    status,
    data,
    error,
    abortRequest,
    transition: {
      state: transitionState,
      formData,
    } as Transition,
  }
}
