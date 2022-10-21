/*
 * @microeinhundert/radonis-hydrate
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { ComponentIdentifier, Components, PluginsManagerContract } from '@microeinhundert/radonis-types'
import type { ComponentType } from 'react'
import { createElement as h, StrictMode } from 'react'
import { hydrateRoot } from 'react-dom/client'

import { HydrationContextProvider } from '../contexts/hydration_context'
import { HydrationException } from '../exceptions/hydration_exception'
import { HYDRATION_ROOT_SELECTOR } from './constants'
import { getManifestOrFail } from './utils/get_manifest_or_fail'

/**
 * @internal
 */
export class Hydrator {
  /**
   * The singleton instance
   */
  static instance?: Hydrator

  /**
   * Get the singleton instance
   */
  static getSingletonInstance(...args: ConstructorParameters<typeof Hydrator>): Hydrator {
    return (Hydrator.instance = Hydrator.instance ?? new Hydrator(...args))
  }

  /**
   * The PluginsManager instance
   */
  #pluginsManager: PluginsManagerContract

  /**
   * The components
   */
  #components: Components

  /**
   * Constructor
   */
  constructor(pluginsManager: PluginsManagerContract) {
    this.#pluginsManager = pluginsManager

    this.#components = new Map()
  }

  /**
   * Register a component
   */
  registerComponent(identifier: ComponentIdentifier, Component: ComponentType): this {
    if (this.#components.has(identifier)) {
      throw HydrationException.componentAlreadyRegistered(identifier)
    }

    this.#components.set(identifier, Component)

    return this
  }

  /**
   * Hydrate the HydrationRoots
   */
  hydrateRoots(): this {
    const hydrationRoots = document.querySelectorAll(HYDRATION_ROOT_SELECTOR)
    const rootObserver = this.#createRootObserver()!

    for (const hydrationRoot of hydrationRoots) {
      rootObserver.observe(hydrationRoot)
    }

    return this
  }

  /**
   * Hydrate a specific HydrationRoot
   */
  async #hydrateRoot(hydrationRoot: HTMLElement): Promise<void> {
    const manifest = getManifestOrFail()
    const hydrationRootId = hydrationRoot.dataset.hydrationRoot!
    const hydration = manifest.hydration[hydrationRootId]

    if (!hydration) {
      throw HydrationException.missingHydrationData(hydrationRootId)
    }

    const Component = this.#components.get(hydration.componentIdentifier)

    if (!Component) {
      throw HydrationException.cannotHydrate(hydrationRootId, hydration.componentIdentifier)
    }

    const tree = await this.#pluginsManager.execute(
      'beforeHydrate',
      h(
        HydrationContextProvider,
        {
          value: {
            hydrated: true,
            id: hydrationRootId,
          },
        },
        h(Component, hydration.props)
      ),
      null
    )

    hydrateRoot(hydrationRoot, h(StrictMode, null, tree))
  }

  /**
   * Create the observer for observing the visibility of HydrationRoots
   */
  #createRootObserver(): IntersectionObserver | undefined {
    return new IntersectionObserver((observedHydrationRoots, observer) => {
      observedHydrationRoots.forEach(async (observedHydrationRoot) => {
        if (!observedHydrationRoot.isIntersecting) return

        const hydrationRoot = observedHydrationRoot.target as HTMLElement

        await this.#hydrateRoot(hydrationRoot)
        observer.unobserve(hydrationRoot)
      })
    })
  }
}
