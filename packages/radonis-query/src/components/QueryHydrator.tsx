/*
 * @microeinhundert/radonis-query
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { useGlobals } from '@microeinhundert/radonis-hooks'
import { Hydrate } from '@tanstack/react-query'
import type { QueryHydratorProps } from 'src/types'

/**
 * The component for hydrating the queries client-side
 * @internal
 */
export function QueryHydrator({ children }: QueryHydratorProps) {
  const globals = useGlobals()

  return <Hydrate state={(globals as any).dehydratedQueryState}>{children}</Hydrate>
}

QueryHydrator.displayName = 'RadonisQueryHydrator'
