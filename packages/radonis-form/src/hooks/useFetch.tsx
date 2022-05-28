/* eslint-disable @typescript-eslint/no-shadow */

/*
 * @microeinhundert/radonis-form
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { FetchOptions, ResponseParam, Transition, TransitionState } from '@microeinhundert/radonis-types'
import { useEffect, useMemo, useRef, useState } from 'react'

import { createRequestInit } from '../utils/createRequestInit'

export function useFetch<TData, TError>({
  action,
  method,
  encType = 'multipart/form-data',
  headers,
  body,
  transform,
  hooks,
  formData,
}: FetchOptions<TData, TError>) {
  const isFirstRender = useRef(true)

  /**
   * Submit and abort controller states
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

  /**
   * The memoized request object
   */
  const requestObject = useMemo(() => {
    return createRequestInit({
      action,
      method,
      encType,
      requestHeaders: headers,
      requestBody: body,
      transform,
      formData,
    })
  }, [action, body, encType, formData, headers, method, transform])

  useEffect(() => {
    /**
     * Declare new AbortController on every request
     */
    const controller = new AbortController()
    const signal = controller.signal

    async function executeFetch(requestObject: ReturnType<typeof createRequestInit>) {
      try {
        /**
         * Make the request
         */
        const response = await fetch(requestObject.url, {
          ...requestObject.requestInit,
          signal,
        })

        const responseWithData: ResponseParam<TData> = {
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
     * 3. Or Re-Fetch request when abort is `true` (which simulates continuous clicking of the submit button)
     */
    if (!isFirstRender.current && (submit || abort)) {
      /**
       * Generate request `headers` and `body`
       */
      const requestObject = createRequestInit({
        action,
        method,
        encType,
        formData,
        requestBody: body,
        requestHeaders: headers,
        transform,
      })

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
        hooks.beforeRequest(requestObject.requestInit)
      }

      setTransitionState('submitting')

      executeFetch(requestObject)
    }

    /**
     * Abort fetch request on every `submit` and `abort` state changes
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

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [abort, action, body, encType, formData, headers, hooks, method, submit, transform])

  /**
   * Change the first render state to `false` after the first render
   */
  if (isFirstRender.current) {
    isFirstRender.current = false
  }

  /**
   * Abort fetch request
   */
  function abortRequest() {
    setSubmit(false)
    setAbort(false)
  }

  return {
    request: requestObject,
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
