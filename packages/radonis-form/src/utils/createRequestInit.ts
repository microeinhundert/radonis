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

export function createRequestInit({ action, method = 'post', headers, formData }: RequestInitOptions) {
  /**
   * The URL constructor requires an absolute URL,
   * therefore we set a fake base URL and remove it afterwards
   */
  const url = new URL(action, 'https://example.com')

  const requestInit: RequestInit = {
    method,
    headers: {
      Accept: 'application/json',
      ...(headers ?? {}),
    },
  }

  switch (method) {
    case 'get': {
      if (!formData) {
        break
      }

      for (const entity of formData.entries()) {
        url.searchParams.append(entity[0], entity[1].toString())
      }

      break
    }
    default: {
      requestInit.body = formData
    }
  }

  return {
    url: urlToRelativePath(url),
    method,
    requestInit,
    form: {
      get action() {
        const actionUrl = url

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
