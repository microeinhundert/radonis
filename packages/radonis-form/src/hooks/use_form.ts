/*
 * @microeinhundert/radonis-form
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { useMutation, useUrlBuilder } from '@microeinhundert/radonis-hooks'
import { useHydration } from '@microeinhundert/radonis-hydrate'
import { createInternalURL } from '@microeinhundert/radonis-shared'
import { radonisFetch, stripOriginFromURL } from '@microeinhundert/radonis-shared'
import type { FormEvent } from 'react'
import { useMemo } from 'react'
import { useCallback } from 'react'
import { useRef } from 'react'

import { E_CANNOT_FETCH_WITHOUT_HYDRATION, E_CANNOT_USE_HOOKS_WHEN_RELOADING } from '../exceptions'
import { hydrationManager } from '../singletons'
import type { FormOptions } from '../types/main'

/**
 * Check if a method is natively supported by the form element
 */
function isNativeFormMethod(method: string): boolean {
  return ['get', 'post'].includes(method)
}

/**
 * Hook for creating forms
 * @see https://radonis.vercel.app/docs/hooks/use-form
 */
export function useForm<TData = unknown, TError = unknown>({
  action$,
  params,
  queryParams,
  method,
  hooks,
  noReload,
  throwOnFailure,
  useErrorBoundary,
  ...props
}: FormOptions<TData, TError>) {
  const hydration = useHydration()

  if (hydration.id) {
    hydrationManager.requireRoute(action$)
  }

  if (!noReload && hooks) {
    throw new E_CANNOT_USE_HOOKS_WHEN_RELOADING([action$])
  }

  if (noReload && !hydration.id) {
    throw new E_CANNOT_FETCH_WITHOUT_HYDRATION([action$])
  }

  const ref = useRef<HTMLFormElement | null>(null)
  const urlBuilder = useUrlBuilder()

  const requestUrl = useMemo(
    () => createInternalURL(urlBuilder.make$(action$, { params, queryParams })),
    [urlBuilder, action$, params, queryParams]
  )

  const [mutate, { status, data, error }] = useMutation<FormData, TData, TError>(
    async (formData: FormData) => {
      const requestInit: RequestInit = {
        method,
      }

      switch (method) {
        case 'get': {
          for (const entity of formData.entries()) {
            requestUrl.searchParams.append(entity[0], entity[1].toString())
          }

          break
        }
        default: {
          requestInit.body = formData
        }
      }

      const response = await radonisFetch(stripOriginFromURL(requestUrl), requestInit)

      return response.json<any>()
    },
    { ...hooks, throwOnFailure, useErrorBoundary }
  )

  const submitHandler = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      if (event.defaultPrevented) return
      event.preventDefault()

      mutate(new FormData(event.currentTarget))
    },
    [mutate]
  )

  const getFormProps = () => ({
    ...props,
    onSubmit: noReload ? submitHandler : undefined,
    ref,
    get action() {
      const actionUrl = new URL(requestUrl)

      if (!isNativeFormMethod(method)) {
        actionUrl.searchParams.append('_method', method)
      }

      return stripOriginFromURL(actionUrl)
    },
    get method() {
      return isNativeFormMethod(method) ? method : 'post'
    },
  })

  return {
    status,
    data,
    error,
    ref,
    getFormProps,
  }
}
