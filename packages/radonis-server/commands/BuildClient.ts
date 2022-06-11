/*
 * @microeinhundert/radonis-server
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { BaseCommand, flags } from '@adonisjs/ace'
import type { RadonisConfig } from '@ioc:Adonis/Addons/Radonis'
import { buildEntryFileAndComponents, discoverComponents } from '@microeinhundert/radonis-build'
import { invariant } from '@microeinhundert/radonis-shared'
import chokidar from 'chokidar'
import { existsSync } from 'fs'
import { parse } from 'path'

/**
 * Yield a script path
 */
function yieldScriptPath(path: string): string {
  if (existsSync(path)) {
    return path
  }

  const { ext } = parse(path)

  return ext ? path.replace(ext, '.js') : yieldScriptPath(`${path}.ts`)
}

/**
 * A command to build the client
 */
export default class BuildClient extends BaseCommand {
  public static commandName = 'build:client'
  public static description = 'Build the Radonis client'
  public static settings = {
    loadApp: true,
    stayAlive: true,
  }

  /**
   * Build for production
   */
  @flags.boolean({ description: 'Build for production' })
  public production: boolean

  /**
   * Allows watching a directory for file changes
   */
  @flags.string({ description: 'Directory to watch for changes' })
  public watchDir: string

  /**
   * Allows configuring the output directory
   */
  @flags.string({ description: 'Directory to output built files to' })
  public outputDir: string

  /**
   * The Radonis config
   */
  private config: RadonisConfig = this.application.config.get('radonis', {})

  /**
   * Get the path to the entry file
   */
  private get entryFilePath() {
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
  private get componentsDirPath() {
    const {
      client: { componentsDir },
    } = this.config

    invariant(existsSync(componentsDir), `The Radonis components directory does not exist at "${componentsDir}"`)

    return componentsDir
  }

  /**
   * Run the build
   */
  private async build() {
    const {
      client: { outputDir, buildOptions },
    } = this.config

    this.logger.info(`building the client...`)

    const components = discoverComponents(this.componentsDirPath)

    const { buildManifest } = await buildEntryFileAndComponents(
      this.entryFilePath,
      components,
      this.outputDir || outputDir,
      this.production,
      buildOptions
    )

    /**
     * Output a log message after successful build
     * (substracting by one to exclude the entry file)
     */
    this.logger.success(`successfully built the client for ${Object.keys(buildManifest).length - 1} component(s)`)

    /**
     * Output the build manifest
     */
    this.generator
      .addFile('build-manifest', { extname: '.json' })
      .stub(
        JSON.stringify(buildManifest, (_, value) => (value instanceof Set ? [...value] : value), 2),
        { raw: true }
      )
      .destinationDir(outputDir)
      .appRoot(this.application.appRoot)

    /**
     * Run the Generator
     */
    await this.generator.run()
  }

  /**
   * Run the command
   */
  public async run() {
    await this.build()

    if (this.watchDir) {
      /**
       * Initialize the watcher
       */
      const watcher = chokidar.watch(this.watchDir, {
        cwd: process.cwd(),
        ignoreInitial: true,
      })

      /**
       * Rebuild on changes
       */
      watcher
        .on('ready', () => {
          this.logger.info('watching for file changes...')
        })
        .on('error', () => {
          this.logger.error('rebuilding the client failed')
        })
        .on('all', async () => {
          await this.build()
        })
    } else {
      this.exit()
    }
  }
}
