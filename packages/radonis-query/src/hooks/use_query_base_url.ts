/*
 * @microeinhundert/radonis-query
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { useContext } from "react";

import { baseUrlContext } from "../contexts/base_url_context";

/**
 * Hook for retrieving the base url set for queries
 * @see https://radonis.vercel.app/docs/plugins/query#querying-data
 */
export function useQueryBaseUrl() {
  return useContext(baseUrlContext);
}
