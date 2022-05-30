/*
 * @microeinhundert/radonis-form
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { RequestInitOptions } from '../types'

/**
 * Check if a method is natively supported by the <form> element
 */
function isNativeFormMethod(method: string): boolean {
  return ['get', 'post'].includes(method)
}

/**
 * Convert an URL to a relative path
 */
function urlToRelativePath(url: URL): string {
  return url.toString().replace(url.origin, '')
}

export function createRequestInit({ action, method = 'post', formData }: RequestInitOptions) {
  /**
   * Because of the URL constructor requiring an absolute URL,
   * we have to pass a fake base URL
   */
  const requestUrl = new URL(action, 'https://example.com')

  const requestInit: RequestInit = {
    method,
    headers: {
      Accept: 'application/json',
    },
  }

  switch (method) {
    case 'get': {
      if (!formData) {
        break
      }

      for (const entity of formData.entries()) {
        requestUrl.searchParams.append(entity[0], entity[1].toString())
      }

      break
    }
    default: {
      requestInit.body = formData
    }
  }

  return {
    requestUrl: urlToRelativePath(requestUrl),
    requestInit,
    form: {
      data: formData,
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
    },
  }
}
