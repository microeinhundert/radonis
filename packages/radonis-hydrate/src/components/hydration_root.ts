/*
 * @microeinhundert/radonis-hydrate
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { assetsManagerContext, manifestManagerContext } from '@microeinhundert/radonis-server/standalone'
import type { ReactElement } from 'react'
import { Children, createElement as h, isValidElement, useContext, useId } from 'react'

import { HydrationContextProvider } from '../contexts/hydration_context'
import { E_CANNOT_HYDRATE_WITH_CHILDREN, E_NOT_AN_ISLAND } from '../exceptions'
import { useHydration } from '../hooks/use_hydration'
import { islandIdentifierSymbol } from '../symbols'

/**
 * Component for hydrating islands
 * @see https://radonis.vercel.app/docs/components#hydrating-components
 */
export function HydrationRoot({
  children,
  className,
  disabled,
}: {
  children: ReactElement<Record<string, unknown>>
  className?: string
  disabled?: boolean
}) {
  const manifestManager = useContext(manifestManagerContext)
  const assetsManager = useContext(assetsManagerContext)
  const { id: parentHydrationRootId } = useHydration()
  const hydrationRootId = useId()

  const island = Children.only(children)
  const islandIdentifier = island?.type?.[islandIdentifierSymbol]

  if (typeof islandIdentifier !== 'string' || !isValidElement(island)) {
    throw new E_NOT_AN_ISLAND([hydrationRootId])
  }

  if (island.props.children) {
    throw new E_CANNOT_HYDRATE_WITH_CHILDREN([islandIdentifier, hydrationRootId])
  }

  /*
   * Ignore if unsupported environment, disabled or child of another HydrationRoot
   */
  if (!manifestManager || !assetsManager || disabled || parentHydrationRootId) {
    return h(
      'div',
      {
        className,
      },
      island
    )
  }

  /*
   * Register the hydration on the ManifestManager
   */
  manifestManager.registerHydration(hydrationRootId, islandIdentifier, island.props)

  /*
   * Require the island on the AssetsManager
   */
  assetsManager.requireIsland(islandIdentifier)

  return h(
    HydrationContextProvider,
    {
      value: {
        hydrated: false,
        id: hydrationRootId,
      },
    },
    h(
      'div',
      {
        className,
        'data-hydration-root': hydrationRootId,
      },
      island
    )
  )
}

HydrationRoot.displayName = 'RadonisHydrationRoot'
