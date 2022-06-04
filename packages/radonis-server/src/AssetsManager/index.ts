/*
 * @microeinhundert/radonis-server
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { RadonisConfig } from '@ioc:Adonis/Addons/Radonis'
import type { AssetsManifest } from '@microeinhundert/radonis-build'
import { generateAssetsManifest, readBuildManifestFromDisk } from '@microeinhundert/radonis-build'
import { extractRequiredAssets } from '@microeinhundert/radonis-build'
import { PluginsManager } from '@microeinhundert/radonis-shared'
import { fsReadAll } from '@poppinss/utils/build/helpers'
import { readFileSync } from 'fs'
import { join } from 'path'

export class AssetsManager {
  /**
   * The PluginsManager instance
   */
  private pluginsManager: PluginsManager = PluginsManager.getInstance()

  /**
   * The assets manifest
   */
  private assetsManifest: AssetsManifest = []

  /**
   * The components required for hydration
   */
  private componentsRequiredForHydration: Set<string> = new Set()

  /**
   * Constructor
   */
  constructor(private config: Pick<RadonisConfig, 'client'>) {}

  /**
   * Initialize
   */
  public async init(): Promise<void> {
    const { outputDir } = this.config.client

    const buildManifest = await readBuildManifestFromDisk(outputDir)
    const assetsManifest = await generateAssetsManifest(buildManifest)

    fsReadAll(outputDir, (filePath) => filePath.endsWith('.js')).forEach((filePath) => {
      const absoluteFilePath = join(outputDir, filePath)
      this.pluginsManager.execute('afterReadFile', null, [absoluteFilePath, readFileSync(absoluteFilePath, 'utf8')])
    })

    this.assetsManifest = assetsManifest
  }

  /**
   * Get the components
   */
  public getComponents() {
    return this.assetsManifest.filter(({ type }) => type === 'component').map(({ identifier }) => identifier)
  }

  /**
   * Require a component for hydration
   */
  public requireComponentForHydration(identifier: string): void {
    this.componentsRequiredForHydration.add(identifier)
  }

  /**
   * Get the hydration requirements
   */
  public getHydrationRequirements(): AssetsManifest {
    return extractRequiredAssets(this.assetsManifest, {
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
