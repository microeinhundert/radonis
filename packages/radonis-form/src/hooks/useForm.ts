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
import type { FormEvent } from 'react'
import { useCallback } from 'react'
import { useRef } from 'react'

import { FormException } from '../exceptions/formException'
import { hydrationManager } from '../singletons'
import type { FormOptions } from '../types'

/**
 * Check if a method is natively supported by the <form> element
 */
export function isNativeFormMethod(method: string): boolean {
  return ['get', 'post'].includes(method)
}

/**
 * Convert an URL to a relative path
 */
export function urlToRelativePath(url: URL): string {
  return url.toString().replace(url.origin, '')
}

/**
 * Hook for submitting a form via fetch
 * @see https://radonis.vercel.app/docs/forms
 */
export function useForm<TData, TError>({
  action,
  params,
  queryParams,
  method,
  hooks,
  reloadDocument,
  throwOnFailure,
  useErrorBoundary,
  ...props
}: FormOptions<TData, TError>) {
  const hydration = useHydration()

  if (hydration.root) {
    hydrationManager.requireRoute(action)
  }

  if (hooks && reloadDocument) {
    throw FormException.cannotCombineReloadWithHooks()
  }
  if (!reloadDocument && !hydration.root) {
    throw FormException.cannotFetchWithoutHydration()
  }

  const form = useRef<HTMLFormElement | null>(null)
  const urlBuilder = useUrlBuilder()

  /**
   * Because of the URL constructor requiring an absolute URL,
   * we have to pass a fake base URL to it
   */
  const requestUrl = new URL(urlBuilder.make(action, { params, queryParams }), 'http://localhost')

  const [mutate, { status, data, error }] = useMutation<FormData, TData, TError>(
    async (formData: FormData) => {
      const requestInit: RequestInit = {
        method,
        headers: {
          Accept: 'application/json',
        },
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

      const response = await fetch(urlToRelativePath(requestUrl), requestInit)

      if (!response.ok) {
        throw FormException.requestFailed(action, response.status)
      }

      return response.json()
    },
    { ...(hooks ?? {}), throwOnFailure, useErrorBoundary }
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
    onSubmit: reloadDocument ? undefined : submitHandler,
    ref: form,
    ...props,
    get action() {
      const actionUrl = requestUrl

      if (!isNativeFormMethod(method)) {
        actionUrl.searchParams.append('_method', method)
      }

      return urlToRelativePath(actionUrl)
    },
    get method() {
      return isNativeFormMethod(method) ? method : 'post'
    },
  })

  return {
    status,
    data,
    error,
    getFormProps,
  }
}
