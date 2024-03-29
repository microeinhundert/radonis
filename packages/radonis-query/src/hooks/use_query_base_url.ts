/*
 * @microeinhundert/radonis-query
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { useContext } from 'react'

import { baseUrlContext } from '../contexts/base_url_context'
import { E_UNKNOWN_BASE_URL } from '../exceptions'

/**
 * Hook for retrieving the base URL set for queries
 * @see https://radonis.vercel.app/docs/plugins/query#querying-data
 */
export function useQueryBaseUrl() {
  const baseUrl = useContext(baseUrlContext)

  if (!baseUrl) {
    throw new E_UNKNOWN_BASE_URL()
  }

  return baseUrl
}
