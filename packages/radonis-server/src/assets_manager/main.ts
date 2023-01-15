/*
 * @microeinhundert/radonis-server
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { ApplicationContract } from '@ioc:Adonis/Core/Application'
import {
  extractRequiredAssets,
  generateAssetsManifest,
  readBuildManifestFromDisk,
} from '@microeinhundert/radonis-build'
import type { AssetsManagerContract, AssetsManifest, Resettable } from '@microeinhundert/radonis-types'

/**
 * Service for managing assets
 * @internal
 */
export class AssetsManager implements AssetsManagerContract, Resettable {
  /**
   * The singleton instance
   */
  static instance?: AssetsManager

  /**
   * Get the singleton instance
   */
  static getSingletonInstance(...args: ConstructorParameters<typeof AssetsManager>): AssetsManager {
    return (AssetsManager.instance = AssetsManager.instance ?? new AssetsManager(...args))
  }

  /**
   * The public path
   */
  #publicPath: string

  /**
   * The assets manifest
   */
  #assetsManifest: AssetsManifest

  /**
   * The required islands
   */
  #requiredIslands: Set<string>

  /**
   * Constructor
   */
  constructor(application: ApplicationContract) {
    this.#publicPath = application.publicPath('radonis')

    this.#assetsManifest = []

    this.#setDefaults()
  }

  /**
   * The required assets
   */
  get requiredAssets(): AssetsManifest {
    return extractRequiredAssets(this.#assetsManifest, {
      islands: this.#requiredIslands,
    })
  }

  /**
   * Require an island
   */
  requireIsland(identifier: string): void {
    this.#requiredIslands.add(identifier)
  }

  /**
   * Update the assets manifest by reading the build manifest
   * and generating the assets manifest from it
   */
  async updateAssetsManifest(): Promise<void> {
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
    this.#requiredIslands = new Set()
  }
}
