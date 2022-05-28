/*
 * @microeinhundert/radonis-form
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { EncType, Headers, Method, RequestInitOptions } from '@microeinhundert/radonis-types'

/**
 * Generate the request headers and body based on the `encType` and `requestBody`.
 * The function will serialize the `formData` to an appropriate `body` type based on `encType` value.
 *
 * When `requestBody` is not empty, the `Content-Type` header will be set to `application/json`
 * and `requestBody` will be used as the `body`. So the `requestBody` needs to be a valid JSON string.
 */
export function createRequestInit({
  action,
  method,
  encType,
  requestHeaders,
  requestBody,
  transform,
  formData,
}: RequestInitOptions) {
  /**
   * The default request headers
   */
  const headers: Headers = requestHeaders || {}

  /**
   * The default body
   */
  let body: FormData | string | undefined = formData

  /**
   * The requqest param
   */
  let requestParam = ''

  /**
   * The request encoding type
   */
  const requestEncType = encType || 'application/x-www-form-urlencoded'

  /**
   * The request method
   */
  const requestMethod: Method = method || 'post'

  if (requestEncType === 'application/x-www-form-urlencoded') {
    headers['Content-Type'] = `${requestEncType};charset=UTF-8`

    const params = new URLSearchParams()

    if (formData) {
      for (const entity of formData.entries()) {
        params.append(entity[0], entity[1].toString())
      }
    }

    for (const key in requestBody) {
      params.append(key, requestBody[key])
    }

    body = params
  }

  if (requestEncType === 'application/json') {
    headers['Content-Type'] = `${requestEncType};charset=UTF-8`

    let json: any = {}

    if (formData) {
      for (const entity of formData.entries()) {
        json[entity[0]] = entity[1].toString()
      }
    }

    for (const key in requestBody) {
      json[key] = requestBody[key]
    }

    if (transform) json = transform(json)

    body = JSON.stringify(json)
  }

  if (requestMethod === 'get') {
    body = undefined

    const params = new URLSearchParams()

    if (formData) {
      for (const entity of formData.entries()) {
        params.append(entity[0], entity[1].toString())
      }
    }

    for (const key in requestBody) {
      params.append(key, requestBody[key])
    }

    requestParam = params.toString()
  }

  const requestInit: RequestInit = {
    method: requestMethod,
    headers,
  }

  const isSearchParamRequired = !/\?$/g.test(action) && method === 'get'
  const searchParam = isSearchParamRequired ? '?' : ''

  /**
   * If the requestMethod is not `get`,
   * set `body` on the request init object
   */
  if (requestMethod !== 'get') {
    requestInit.body = body
  }

  return {
    url: `${action}${searchParam}${requestParam}`,
    formUrl: action,
    method: requestInit.method as Method,
    encType: headers['Content-Type'] as EncType,
    requestInit,
  }
}
