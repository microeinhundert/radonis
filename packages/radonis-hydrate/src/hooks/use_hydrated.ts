/*
 * @microeinhundert/radonis-hydrate
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { useEffect, useState } from 'react'

import { useHydration } from './use_hydration'

/**
 * Hook for checking if a component was hydrated client-side
 * @see https://radonis.vercel.app/docs/hooks/use-hydrated
 */
export function useHydrated() {
  const hydration = useHydration()
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setHydrated(hydration.hydrated)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return hydrated
}
