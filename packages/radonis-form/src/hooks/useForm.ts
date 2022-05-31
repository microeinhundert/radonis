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
import { useRef } from 'react'
import useMutation from 'use-mutation'

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

export function useForm<TData = unknown, TError = unknown>({
  action,
  params,
  queryParams,
  method,
  hooks,
  reloadDocument,
  ...props
}: FormOptions<TData, TError>) {
  const hydration = useHydration()

  if (hydration.root) {
    HydrationManager.getInstance().requireRouteForHydration(action)
  }

  const form = useRef<HTMLFormElement | null>(null)
  const urlBuilder = useUrlBuilder()

  urlBuilder.withParams(params)
  urlBuilder.withQueryParams(queryParams)

  /**
   * Because of the URL constructor requiring an absolute URL,
   * we have to pass a fake base URL to the URL constructor
   */
  const requestUrl = new URL(urlBuilder.make(action), 'https://example.com')

  const [mutate, { status, data, error }] = useMutation<FormData, TData, TError>(async (formData: FormData) => {
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

    if (!response.ok) throw new Error(response.statusText)

    return response.json()
  }, hooks)

  /**
   * The submit handler
   */
  function submitHandler(event: FormEvent<HTMLFormElement>) {
    if (event.defaultPrevented) return
    event.preventDefault()

    mutate(new FormData(event.currentTarget))
  }

  /**
   * The form props getter
   */
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
