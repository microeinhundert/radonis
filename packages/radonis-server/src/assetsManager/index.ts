/*
 * @microeinhundert/radonis-server
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { ApplicationContract } from '@ioc:Adonis/Core/Application'
import type { RadonisConfig } from '@ioc:Microeinhundert/Radonis'
import type { AssetsManifest } from '@microeinhundert/radonis-build'
import {
  extractRequiredAssets,
  generateAssetsManifest,
  readBuildManifestFromDisk,
} from '@microeinhundert/radonis-build'
import type { ComponentIdentifier, Resettable } from '@microeinhundert/radonis-types'

/**
 * @internal
 */
export class AssetsManager implements Resettable {
  /**
   * The Radonis config
   */
  #config: RadonisConfig

  /**
   * The public path
   */
  #publicPath: string

  /**
   * The assets manifest
   */
  #assetsManifest: AssetsManifest

  /**
   * The required components
   */
  #requiredComponents: Set<ComponentIdentifier>

  /**
   * Constructor
   */
  constructor(application: ApplicationContract) {
    this.#config = application.container.resolveBinding('Microeinhundert/Radonis/Config')

    this.#publicPath = application.publicPath('radonis')

    this.#assetsManifest = []

    this.#setDefaults()
  }

  /**
   * The required assets
   */
  get requiredAssets(): AssetsManifest {
    return extractRequiredAssets(
      this.#assetsManifest,
      {
        components: this.#requiredComponents,
      },
      !this.#config.client.alwaysIncludeEntryFile
    )
  }

  /**
   * Require a component
   */
  requireComponent(identifier: ComponentIdentifier): void {
    this.#requiredComponents.add(identifier)
  }

  /**
   * Read the build manifest
   */
  async readBuildManifest(): Promise<void> {
    const buildManifest = await readBuildManifestFromDisk(this.#publicPath)

    if (!buildManifest) {
      this.#assetsManifest = []
      return
    }

    try {
      const assetsManifest = await generateAssetsManifest(buildManifest)
      this.#assetsManifest = assetsManifest
    } catch {
      this.#assetsManifest = []
    }
  }

  /**
   * Reset for a new request
   */
  reset(): void {
    this.#setDefaults()
  }

  /**
   * Set the defaults
   */
  #setDefaults(): void {
    this.#requiredComponents = new Set()
  }
}
