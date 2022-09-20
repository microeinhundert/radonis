/*
 * @microeinhundert/radonis-server
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { useAdonis } from './useAdonis'

/**
 * Hook for retrieving the AdonisJS `RouterContract`
 * @see https://radonis.vercel.app/docs/hooks/use-router
 */
export function useRouter() {
  const { router } = useAdonis()

  return router
}