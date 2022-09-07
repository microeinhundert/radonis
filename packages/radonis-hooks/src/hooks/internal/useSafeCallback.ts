/*
 * @microeinhundert/radonis-hooks
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { useCallback } from 'react'

import { useIsMounted } from './useIsMounted'

/**
 * @internal
 */
export function useSafeCallback<Arguments extends any[] = any[], ReturnValue = any>(
  callback: (...args: Arguments) => ReturnValue
) {
  const isMounted = useIsMounted()

  return useCallback((...args: Arguments) => (isMounted.current ? callback(...args) : void 0), [callback, isMounted])
}
