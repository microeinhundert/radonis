/*
 * @microeinhundert/radonis-hooks
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { useRef } from 'react'

import { useUniversalLayoutEffect } from './useUniversalLayoutEffect'

export function useIsMounted() {
  const isMounted = useRef(false)

  useUniversalLayoutEffect(() => {
    isMounted.current = true

    return () => {
      isMounted.current = false
    }
  }, [])

  return isMounted
}
