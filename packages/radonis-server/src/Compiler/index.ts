/*
 * @microeinhundert/radonis-server
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { RadonisConfig } from '@ioc:Adonis/Addons/Radonis'
import type { LoggerContract } from '@ioc:Adonis/Core/Logger'
import { existsSync } from 'fs'
import invariant from 'tiny-invariant'

import { extractRequiredAssets, generateAssetManifest } from './asset'
import { buildEntryFileAndComponents } from './build'
import { discoverComponents, yieldScriptPath } from './utils'

export class Compiler {
  /**
   * The asset manifest
   */
  private assetManifest: Radonis.AssetManifest = []

  /**
   * The components required for hydration
   */
  private componentsRequiredForHydration: Set<string> = new Set()

  /**
   * Constructor
   */
  constructor(private logger: LoggerContract, private config: RadonisConfig) {}

  /**
   * Get the path to the entry file
   */
  private getEntryFilePath() {
    let {
      client: { entryFile },
    } = this.config

    entryFile = yieldScriptPath(entryFile)

    invariant(existsSync(entryFile), `The Radonis entry file does not exist at "${entryFile}"`)

    return entryFile
  }

  /**
   * Get the path to the components directory
   */
  private getComponentsDirPath() {
    const {
      client: { componentsDir },
    } = this.config

    invariant(existsSync(componentsDir), `The Radonis components directory does not exist at "${componentsDir}"`)

    return componentsDir
  }

  /**
   * Compile
   */
  public async compile(): Promise<void> {
    const {
      client: { outputDir, buildOptions },
    } = this.config

    try {
      const componentsDirPath = this.getComponentsDirPath()
      const entryFilePath = this.getEntryFilePath()
      const components = discoverComponents(componentsDirPath)
      const buildManifest = await buildEntryFileAndComponents(entryFilePath, components, outputDir, buildOptions)

      /**
       * Output a log message after successful compilation
       * (substracting by one to exclude the entry file)
       */
      this.logger.info(`finished compilation of ${Object.keys(buildManifest).length - 1} component(s)`)

      this.assetManifest = generateAssetManifest(buildManifest)
    } catch (error) {
      const messageParts = error.message.split('error:')
      throw new Error(messageParts.at(-1).trim())
    }
  }

  /**
   * Require a component for hydration
   */
  public requireComponentForHydration(identifier: string): void {
    this.componentsRequiredForHydration.add(identifier)
  }

  /**
   * Get the assets required for hydration
   */
  public getAssetsRequiredForHydration(): Radonis.AssetManifest {
    return extractRequiredAssets(this.assetManifest, {
      components: this.componentsRequiredForHydration,
    })
  }

  /**
   * Prepare for a new request
   */
  public prepareForNewRequest(): void {
    this.componentsRequiredForHydration.clear()
  }
}
