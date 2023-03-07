/*
 * @microeinhundert/radonis-server
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { join } from 'node:path'

import { BaseCommand, flags } from '@adonisjs/ace'
import { files } from '@adonisjs/sink'
import type { RadonisConfig } from '@ioc:Microeinhundert/Radonis'
import type { BuiltAssets } from '@microeinhundert/radonis-build'
import { AssetsManifestBuilder, ClientBuilder } from '@microeinhundert/radonis-build'
import { getEntryPoints, writeAssetsManifestToDisk } from '@microeinhundert/radonis-build/utils'

/**
 * A command to build the Radonis client
 */
export default class BuildClient extends BaseCommand {
  static commandName = 'build:client'
  static description = 'Build the Radonis client'
  static settings = {
    loadApp: true,
    stayAlive: true,
  }

  @flags.boolean({ description: 'Whether to build for production' })
  production: boolean | undefined

  @flags.boolean({ description: 'Whether to automatically build on file changes' })
  watch: boolean | undefined

  /**
   * The Radonis config
   */
  #config: RadonisConfig = this.application.config.get('radonis', {})

  /**
   * The public path
   */
  get #publicPath() {
    const publicDir = this.application.directoriesMap.get('public') || 'public'

    /**
     * Resolve path using outDir from tsconfig when building for production
     */
    if (this.production) {
      const tsConfig = new files.JsonFile(this.application.appRoot, 'tsconfig.json')
      const compilerOutDir = tsConfig.get('compilerOptions.outDir') || 'build'

      return join(this.application.appRoot, compilerOutDir, publicDir)
    }

    return join(this.application.appRoot, publicDir)
  }

  /**
   * The output path
   */
  get #outputPath() {
    return join(this.#publicPath, 'radonis')
  }

  /**
   * Run the command
   */
  async run(): Promise<void> {
    const {
      client: { buildOptions },
    } = this.#config

    const entryPoints = await getEntryPoints(this.application.resourcesPath())
    const clientBuilder = new ClientBuilder()

    clientBuilder.on('end', async (builtAssets: BuiltAssets) => {
      const assetsManifestBuilder = new AssetsManifestBuilder(builtAssets)
      const assetsManifest = assetsManifestBuilder.build()
      await writeAssetsManifestToDisk(assetsManifest, this.#outputPath)
      this.logger.success('built the client bundle successfully')
    })

    const rebuildOnFileChanges = !!(this.watch && !this.production)

    /**
     * Build the client
     */
    await clientBuilder.build({
      entryPoints,
      appRootPath: this.application.appRoot,
      publicPath: this.#publicPath,
      outputPath: this.#outputPath,
      outputForProduction: this.production,
      rebuildOnFileChanges,
      esbuildOptions: buildOptions,
    })

    if (!rebuildOnFileChanges) {
      this.exit()
    }
  }
}
