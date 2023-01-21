/*
 * @microeinhundert/radonis-server
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { join, relative, resolve } from 'node:path/posix'

import { BaseCommand, flags } from '@adonisjs/ace'
import { files } from '@adonisjs/sink'
import type { RadonisConfig } from '@ioc:Microeinhundert/Radonis'
import { ClientBuilder, writeAssetsManifestToDisk } from '@microeinhundert/radonis-build'
import type { AssetsManifest } from '@microeinhundert/radonis-types'
import { fsReadAll } from '@poppinss/utils/build/helpers'
import chokidar from 'chokidar'

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

  @flags.string({ description: 'Glob pattern of files that should automatically trigger a rebuild' })
  watch: string | undefined

  /**
   * The Radonis config
   */
  #config: RadonisConfig = this.application.config.get('radonis', {})

  /**
   * The output directory
   */
  get #outputDir(): string {
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
   * Build the client
   */
  async #buildClient(): Promise<AssetsManifest> {
    const {
      client: { buildOptions },
    } = this.#config

    const client = new ClientBuilder()

    const entryPoints = fsReadAll(this.application.resourcesPath(), (filePath) => {
      return /\.(client|island)\.(ts(x)?|js(x)?)$/.test(filePath)
    }).map((filePath) => join(this.application.resourcesPath(), filePath))

    const publicDir = this.application.rcFile.directories.public || 'public'

    /**
     * Execute the build
     */
    const assetsManifest = await client.build({
      entryPoints,
      publicDir,
      outputDir: this.#outputDir,
      outputToDisk: true,
      outputForProduction: this.production,
      esbuildOptions: buildOptions,
    })

    /**
     * Write the assets manifest to disk
     */
    await writeAssetsManifestToDisk(assetsManifest, this.#outputDir)

    this.logger.success('successfully built the client bundle')

    return assetsManifest
  }

  /**
   * Run the command
   */
  async run(): Promise<void> {
    await this.#buildClient()

    if (this.watch && !this.production) {
      /**
       * Initialize the file watcher
       */
      const watcher = chokidar.watch(resolve(this.application.appRoot, this.watch), {
        cwd: process.cwd(),
        ignoreInitial: true,
      })

      /**
       * Rebuild on file changes
       */
      watcher
        .on('ready', () => {
          this.logger.info('watching for file changes...')
        })
        .on('error', () => {
          this.logger.error('rebuilding the client failed')
        })
        .on('all', async () => {
          await this.#buildClient()
        })
    } else {
      this.exit()
    }
  }
}
