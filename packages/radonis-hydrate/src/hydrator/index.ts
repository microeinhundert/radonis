/*
 * @microeinhundert/radonis-hydrate
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { PluginsManager } from '@microeinhundert/radonis-shared'
import type { Components } from '@microeinhundert/radonis-types'
import type { ComponentType } from 'react'
import { createElement as h, StrictMode } from 'react'
import { hydrateRoot } from 'react-dom/client'

import { HydrateException } from '../exceptions/hydrateException'
import { HydrationContextProvider } from '../react'
import { HYDRATION_ROOT_SELECTOR } from './constants'
import { getManifestOrFail } from './utils/getManifestOrFail'

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
  static getSingletonInstance(...params: ConstructorParameters<typeof Hydrator>): Hydrator {
    return Hydrator.instance ?? new Hydrator(...params)
  }

  /**
   * The PluginsManager instance
   */
  #pluginsManager: PluginsManager

  /**
   * The components
   */
  #components: Components

  /**
   * Constructor
   */
  constructor(pluginsManager: PluginsManager) {
    Hydrator.instance = this

    this.#pluginsManager = pluginsManager

    this.#components = new Map()
  }

  /**
   * Register a component
   */
  registerComponent(identifier: string, Component: ComponentType): this {
    if (identifier in this.#components) {
      throw HydrateException.componentAlreadyRegistered(identifier)
    }

    this.#components[identifier] = Component

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
    const {
      hydrationRoot: hydrationRootIdentifier,
      component: componentIdentifier,
      props: propsHash = '0',
    } = hydrationRoot.dataset

    if (!hydrationRootIdentifier || !componentIdentifier) {
      throw HydrateException.missingHydrationData()
    }

    const Component = this.#components.get(componentIdentifier)

    if (!Component) {
      throw HydrateException.cannotHydrate(componentIdentifier, componentIdentifier)
    }

    const manifest = getManifestOrFail()

    const tree = await this.#pluginsManager.execute(
      'beforeHydrate',
      h(
        HydrationContextProvider,
        {
          value: {
            hydrated: true,
            root: hydrationRootIdentifier,
            component: componentIdentifier,
            propsHash,
          },
        },
        [h(Component, manifest.props[propsHash])]
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
