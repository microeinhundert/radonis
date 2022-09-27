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
import type { PluginsManager } from '@microeinhundert/radonis-shared'
import type { ResetBetweenRequests } from '@microeinhundert/radonis-types'
import { fsReadAll } from '@poppinss/utils/build/helpers'
import { readFileSync } from 'fs'
import { join } from 'path'

/**
 * @internal
 */
export class AssetsManager implements ResetBetweenRequests {
  /**
   * The application
   */
  #application: ApplicationContract

  /**
   * The Radonis config
   */
  #config: RadonisConfig

  /**
   * The PluginsManager instance
   */
  #pluginsManager: PluginsManager

  /**
   * The assets manifest
   */
  #assetsManifest: AssetsManifest

  /**
   * The required components
   */
  #requiredComponents: Set<string>

  /**
   * Constructor
   */
  constructor(application: ApplicationContract) {
    this.#application = application

    this.#config = application.container.resolveBinding('Microeinhundert/Radonis/Config')
    this.#pluginsManager = application.container.resolveBinding('Microeinhundert/Radonis/PluginsManager')

    this.#assetsManifest = []

    this.#requiredComponents = new Set()
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
   * The output directory
   */
  get #outputDir(): string {
    return this.#application.publicPath('radonis')
  }

  /**
   * Read the build manifest
   */
  async readBuildManifest(): Promise<void> {
    const buildManifest = await readBuildManifestFromDisk(this.#outputDir)

    if (!buildManifest) {
      this.#assetsManifest = []
      return
    }

    try {
      const assetsManifest = await generateAssetsManifest(buildManifest)
      this.#assetsManifest = assetsManifest
      this.#scanAssets()
    } catch {
      this.#assetsManifest = []
    }
  }

  /**
   * Require a component
   */
  requireComponent(identifier: string): void {
    this.#requiredComponents.add(identifier)
  }

  /**
   * Reset for a new request
   */
  resetForNewRequest(): void {
    this.#requiredComponents.clear()
  }

  /**
   * Scan the assets
   */
  #scanAssets(): void {
    fsReadAll(this.#outputDir, (assetPath) => assetPath.endsWith('.js')).forEach((assetPath) => {
      const absoluteAssetPath = join(this.#outputDir, assetPath)
      this.#pluginsManager.execute('onScanAsset', null, [readFileSync(absoluteAssetPath, 'utf8'), absoluteAssetPath])
    })
  }
}
