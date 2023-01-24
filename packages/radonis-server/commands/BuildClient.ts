/*
 * @microeinhundert/radonis-server
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { relative, resolve } from 'node:path'

import { BaseCommand, flags } from '@adonisjs/ace'
import { files } from '@adonisjs/sink'
import type { RadonisConfig } from '@ioc:Microeinhundert/Radonis'
import { AssetsManifestBuilder, ClientBuilder, writeAssetsManifestToDisk } from '@microeinhundert/radonis-build'
import { getEntryPoints } from '@microeinhundert/radonis-build'

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

  @flags.string({ description: 'Whether to automatically build on file changes' })
  watch: boolean | undefined

  /**
   * The Radonis config
   */
  #config: RadonisConfig = this.application.config.get('radonis', {})

  /**
   * The output path
   */
  get #outputPath(): string {
    const publicPath = this.application.publicPath('radonis')

    /**
     * Resolve path using outDir from tsconfig when building for production
     */
    if (this.production) {
      const tsConfig = new files.JsonFile(this.application.appRoot, 'tsconfig.json')
      const compilerOutDir = tsConfig.get('compilerOptions.outDir') || 'build'

      return resolve(this.application.appRoot, compilerOutDir, relative(this.application.appRoot, publicPath))
    }

    return publicPath
  }

  /**
   * Run the command
   */
  async run(): Promise<void> {
    const {
      client: { buildOptions },
    } = this.#config

    const entryPoints = await getEntryPoints(this.application.resourcesPath())
    const client = new ClientBuilder()

    client.onBuildEnd(async (builtAssets) => {
      const assetsManifest = new AssetsManifestBuilder(builtAssets).build()
      await writeAssetsManifestToDisk(assetsManifest, this.#outputPath)
    })

    const rebuildOnFileChanges = !!(this.watch && !this.production)

    /**
     * Build the client
     */
    await client.build({
      entryPoints,
      appRootPath: this.application.appRoot,
      publicPath: this.application.publicPath(),
      outputPath: this.#outputPath,
      outputToDisk: true,
      outputForProduction: this.production,
      rebuildOnFileChanges,
      esbuildOptions: buildOptions,
    })

    if (!rebuildOnFileChanges) {
      this.exit()
    }
  }
}
