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
import { readBuildManifestFromDisk } from '@microeinhundert/radonis-build'
import { generateAssetsManifest } from '@microeinhundert/radonis-build'
import { extractRequiredAssets } from '@microeinhundert/radonis-build'
import { PluginsManager } from '@microeinhundert/radonis-shared'
import type { ResetBetweenRequests } from '@microeinhundert/radonis-types'
import { fsReadAll } from '@poppinss/utils/build/helpers'
import { readFileSync } from 'fs'
import { join } from 'path'

/**
 * @internal
 */
export class AssetsManager implements ResetBetweenRequests {
  /**
   * The PluginsManager instance
   */
  #pluginsManager: PluginsManager

  /**
   * The Radonis config
   */
  #config: Pick<RadonisConfig, 'client'>

  /**
   * The application
   */
  #application: ApplicationContract

  /**
   * The assets manifest
   */
  #assetsManifest: AssetsManifest

  /**
   * The components required for hydration
   */
  #componentsRequiredForHydration: Set<string>

  /**
   * Constructor
   */
  constructor(application: ApplicationContract, config: Pick<RadonisConfig, 'client'>) {
    this.#pluginsManager = PluginsManager.getSingletonInstance()
    this.#application = application
    this.#config = config
    this.#assetsManifest = []
    this.#componentsRequiredForHydration = new Set()
  }

  /**
   * The output directory
   */
  get #outputDir(): string {
    return this.#application.publicPath('radonis')
  }

  /**
   * The components
   */
  get components(): {
    all: AssetsManifest
    requiredForHydration: AssetsManifest
  } {
    return {
      all: this.#assetsManifest.filter(({ type }) => type === 'component'),
      requiredForHydration: extractRequiredAssets(
        this.#assetsManifest,
        {
          components: this.#componentsRequiredForHydration,
        },
        !this.#config.client.alwaysIncludeEntryFile
      ),
    }
  }

  /**
   * Scan the built files
   */
  #scanBuiltFiles(): void {
    fsReadAll(this.#outputDir, (filePath) => filePath.endsWith('.js')).forEach((filePath) => {
      const absoluteFilePath = join(this.#outputDir, filePath)
      this.#pluginsManager.execute('onScanFile', null, [readFileSync(absoluteFilePath, 'utf8'), absoluteFilePath])
    })
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
      this.#scanBuiltFiles()
    } catch {
      this.#assetsManifest = []
    }
  }

  /**
   * Require a component for hydration
   */
  requireComponentForHydration(identifier: string): void {
    this.#componentsRequiredForHydration.add(identifier)
  }

  /**
   * Reset for a new request
   */
  resetForNewRequest(): void {
    this.#componentsRequiredForHydration.clear()
  }
}
