/*
 * @microeinhundert/radonis-hooks
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { FlushCallback } from '@microeinhundert/radonis-types'

import { useRenderer } from '../server/useRenderer'

/**
 * Hook for injecting effects to be executed after rendering
 * @see https://radonis.vercel.app/docs/hooks/use-flush-effects
 */
export function useFlushEffect(callback: FlushCallback) {
  try {
    const renderer = useRenderer()

    renderer.withFlushCallbacks([callback])
  } catch {
    /**
     * Don't throw when used on the client
     */
  }
}
