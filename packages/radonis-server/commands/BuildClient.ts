/*
 * @microeinhundert/radonis-server
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { existsSync } from 'node:fs'
import { relative, resolve } from 'node:path'

import { BaseCommand, flags } from '@adonisjs/ace'
import { files } from '@adonisjs/sink'
import type { RadonisConfig } from '@ioc:Microeinhundert/Radonis'
import { build, discoverHydratableComponents, writeBuildManifestToDisk } from '@microeinhundert/radonis-build'
import type { BuildManifest } from '@microeinhundert/radonis-types'
import chokidar from 'chokidar'

import { CannotFindClientEntryFileException } from '../src/exceptions/cannot_find_client_entry_file'
import { CannotFindComponentsDirectoryException } from '../src/exceptions/cannot_find_components_directory'
import { yieldScriptPath } from '../src/utils/yield_script_path'

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
   * The entry file
   */
  get #entryFile(): string {
    let {
      client: { entryFile },
    } = this.#config

    entryFile = yieldScriptPath(entryFile)

    if (!existsSync(entryFile)) {
      throw new CannotFindClientEntryFileException(entryFile)
    }

    return entryFile
  }

  /**
   * The components directory
   */
  get #componentsDir(): string {
    const {
      client: { componentsDir },
    } = this.#config

    if (!existsSync(componentsDir)) {
      throw new CannotFindComponentsDirectoryException(componentsDir)
    }

    return componentsDir
  }

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
  async #buildClient(): Promise<BuildManifest> {
    const {
      client: { buildOptions },
    } = this.#config

    const publicPath = this.application.rcFile.directories.public || 'public'

    /**
     * Execute the build
     */
    const buildManifest = await build({
      entryFile: this.#entryFile,
      entryPoints: discoverHydratableComponents(this.#componentsDir),
      publicPath,
      outputDir: this.#outputDir,
      outputToDisk: true,
      outputForProduction: this.production,
      esbuildOptions: buildOptions,
    })

    /**
     * Write the build manifest
     */
    await writeBuildManifestToDisk(buildManifest, this.#outputDir)

    /**
     * Output a log message after successful build
     * (substracting by one to exclude the entry file)
     */
    this.logger.success(
      `successfully built the client for ${Object.keys(buildManifest).length - 1} hydratable component(s)`
    )

    return buildManifest
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
