/*
 * @microeinhundert/radonis-server
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { ApplicationContract } from '@ioc:Adonis/Core/Application'
import { readBuildManifestFromDisk } from '@microeinhundert/radonis-build'
import type { AssetsManagerContract, BuildManifest, Resettable } from '@microeinhundert/radonis-types'

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
   * The build manifest
   */
  #buildManifest: BuildManifest

  /**
   * The required islands
   */
  #requiredIslands: Set<string>

  constructor(application: ApplicationContract) {
    this.#publicPath = application.publicPath('radonis')

    this.#buildManifest = []

    this.#setDefaults()
  }

  /**
   * The required assets
   */
  get requiredAssets(): BuildManifest {
    return this.#buildManifest.reduce<BuildManifest>((assets, asset) => {
      if (asset.type === 'client-script') {
        return [...assets, asset]
      }

      if (asset.islands.some((identifier) => this.#requiredIslands.has(identifier))) {
        return [asset, ...assets]
      }

      return assets
    }, [])
  }

  /**
   * Require an island
   */
  requireIsland(identifier: string): void {
    this.#requiredIslands.add(identifier)
  }

  /**
   * Read the build manifest
   */
  async readBuildManifest(): Promise<void> {
    try {
      const buildManifest = await readBuildManifestFromDisk(this.#publicPath)
      if (buildManifest) this.#buildManifest = buildManifest
    } catch {
      this.#buildManifest = []
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
