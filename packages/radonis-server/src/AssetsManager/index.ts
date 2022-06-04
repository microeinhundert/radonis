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
import { extractRequiredAssets, readAssetsManifestFromDisk } from '@microeinhundert/radonis-build'

export class AssetsManager {
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
  public async init(): Promise<AssetsManifest> {
    const { outputDir } = this.config.client

    const assetsManifest = await readAssetsManifestFromDisk(outputDir)

    this.assetsManifest = assetsManifest

    return assetsManifest
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
