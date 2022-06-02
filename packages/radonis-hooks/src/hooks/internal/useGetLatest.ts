/*
 * @microeinhundert/radonis-hooks
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { useCallback, useRef } from 'react'

export function useGetLatest<Value>(value: Value): () => Value {
  const ref = useRef<Value>(value)
  ref.current = value

  return useCallback(() => ref.current, [])
}
