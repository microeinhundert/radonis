/*
 * @microeinhundert/radonis-form
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { RequestInitOptions } from '@microeinhundert/radonis-types'

const BASE = 'https://example.com'
const FORM_METHODS = ['get', 'post']

export function createRequestInit({ action, method = 'post', headers, formData }: RequestInitOptions) {
  const url = new URL(action, BASE)
  const requestInit: RequestInit = {
    method,
    headers,
  }

  if (method === 'get' && formData) {
    for (const entity of formData.entries()) {
      url.searchParams.append(entity[0], entity[1].toString())
    }
  }

  if (method !== 'get') {
    requestInit.body = formData
  }

  return {
    url: url.toString().replace(BASE, ''),
    method,
    requestInit,
    form: {
      get action() {
        const actionUrl = url

        if (!FORM_METHODS.includes(method)) {
          actionUrl.searchParams.append('_method', method)
        }

        return actionUrl.toString().replace(BASE, '')
      },
      get method() {
        return FORM_METHODS.includes(method) ? method : 'post'
      },
    },
  }
}
