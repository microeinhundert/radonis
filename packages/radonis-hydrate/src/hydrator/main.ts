/*
 * @microeinhundert/radonis-hydrate
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { PluginsManagerContract } from '@microeinhundert/radonis-types'
import type { ComponentType } from 'react'
import { createElement as h, StrictMode } from 'react'
import { hydrateRoot } from 'react-dom/client'

import { HydrationContextProvider } from '../contexts/hydration_context'
import { E_CANNOT_HYDRATE } from '../exceptions/cannot_hydrate'
import { E_ISLAND_ALREADY_REGISTERED } from '../exceptions/island_already_registered'
import { getManifestOrFail } from '../utils/get_manifest_or_fail'
import { HYDRATION_ROOT_SELECTOR } from './constants'

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
   * The islands
   */
  #islands: Map<string, ComponentType>

  constructor(pluginsManager: PluginsManagerContract) {
    this.#pluginsManager = pluginsManager

    this.#islands = new Map()
  }

  /**
   * Register an island
   */
  registerIsland(identifier: string, Component: ComponentType): this {
    if (this.#islands.has(identifier)) {
      throw new E_ISLAND_ALREADY_REGISTERED([identifier])
    }

    this.#islands.set(identifier, Component)

    return this
  }

  /**
   * Hydrate all HydrationRoots on the page
   */
  hydrateHydrationRoots(): this {
    const hydrationRoots = document.querySelectorAll(HYDRATION_ROOT_SELECTOR)
    const hydrationRootsObserver = this.#createHydrationRootsObserver()!

    for (const hydrationRoot of hydrationRoots) {
      hydrationRootsObserver.observe(hydrationRoot)
    }

    return this
  }

  /**
   * Hydrate a specific HydrationRoot
   */
  async #hydrateHydrationRoot(hydrationRoot: HTMLElement): Promise<void> {
    const manifest = getManifestOrFail()
    const hydrationRootId = hydrationRoot.dataset.hydrationRoot!
    const hydration = manifest.hydration[hydrationRootId]

    const Island = this.#islands.get(hydration.islandIdentifier)

    if (!Island) {
      throw new E_CANNOT_HYDRATE([hydration.islandIdentifier, hydrationRootId])
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
        h(Island, hydration.props)
      ),
      null
    )

    hydrateRoot(hydrationRoot, h(StrictMode, null, tree))
  }

  /**
   * Create the observer for observing the visibility of HydrationRoots
   */
  #createHydrationRootsObserver(): IntersectionObserver | undefined {
    return new IntersectionObserver((observedHydrationRoots, observer) => {
      observedHydrationRoots.forEach(async (observedHydrationRoot) => {
        if (!observedHydrationRoot.isIntersecting) return

        const hydrationRoot = observedHydrationRoot.target as HTMLElement

        await this.#hydrateHydrationRoot(hydrationRoot)
        observer.unobserve(hydrationRoot)
      })
    })
  }
}
