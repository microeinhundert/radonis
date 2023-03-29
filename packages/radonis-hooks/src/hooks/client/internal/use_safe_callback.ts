/*
 * @microeinhundert/radonis-hooks
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { useCallback } from 'react'

import { useIsMounted } from './use_is_mounted'

export function useSafeCallback<TArguments extends any[] = any[], TReturnValue = any>(
  callback: (...args: TArguments) => TReturnValue
) {
  const isMounted = useIsMounted()

  return useCallback((...args: TArguments) => (isMounted.current ? callback(...args) : void 0), [callback, isMounted])
}
