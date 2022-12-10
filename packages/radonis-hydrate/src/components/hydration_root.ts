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
import { CannotHydrateWithChildrenException } from '../exceptions/cannot_hydrate_with_children'
import { NotHydratableException } from '../exceptions/not_hydratable'
import { useHydration } from '../hooks/use_hydration'
import { componentIdentifierSymbol } from '../symbols'

/**
 * Component for marking components for client-side hydration
 * @see https://radonis.vercel.app/docs/components#hydrating-components
 */
export function HydrationRoot({
  children,
  className,
  disabled,
}: {
  children: ReactElement<Record<string, any>>
  className?: string
  disabled?: boolean
}) {
  const manifestManager = useContext(manifestManagerContext)
  const assetsManager = useContext(assetsManagerContext)
  const { id: parentHydrationRootId } = useHydration()
  const hydrationRootId = useId()

  const component = Children.only(children)
  const componentIdentifier = component?.type?.[componentIdentifierSymbol]

  if (typeof componentIdentifier !== 'string' || !isValidElement(component)) {
    throw new NotHydratableException(hydrationRootId)
  }

  if (component.props.children) {
    throw new CannotHydrateWithChildrenException(hydrationRootId, componentIdentifier)
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
      component
    )
  }

  /*
   * Register the hydration on the ManifestManager
   */
  manifestManager.registerHydration(hydrationRootId, componentIdentifier, component.props)

  /*
   * Require the component on the AssetsManager
   */
  assetsManager.requireComponent(componentIdentifier)

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
      component
    )
  )
}

HydrationRoot.displayName = 'RadonisHydrationRoot'
