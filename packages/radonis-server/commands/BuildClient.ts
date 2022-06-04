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
import { invariant, PluginsManager } from '@microeinhundert/radonis-shared'
import { existsSync } from 'fs'
import { emptyDir, outputFile } from 'fs-extra'
import { parse } from 'path'

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
  @flags.boolean({ description: 'Build for production', alias: 'prod' })
  public production: boolean

  /**
   * Allows watching for file changes
   */
  @flags.boolean({
    description: 'Watch for file changes and re-build the client on change',
    alias: 'w',
  })
  public watch: boolean

  /**
   * The PluginsManager instance
   */
  private pluginsManager: PluginsManager = PluginsManager.getInstance()

  /**
   * The Radonis config
   */
  private config: RadonisConfig = this.application.config.get('radonis', {})

  /**
   * Yield a script path
   */
  private yieldScriptPath(path: string): string {
    if (existsSync(path)) {
      return path
    }

    const { ext } = parse(path)

    return ext ? path.replace(ext, '.js') : this.yieldScriptPath(`${path}.ts`)
  }

  /**
   * Get the path to the entry file
   */
  private getEntryFilePath() {
    let {
      client: { entryFile },
    } = this.config

    entryFile = this.yieldScriptPath(entryFile)

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
   * Run the command
   */
  public async run() {
    const {
      client: { outputDir, buildOptions },
    } = this.config

    this.logger.info(`building the client...`)

    const entryFilePath = this.getEntryFilePath()
    const componentsDirPath = this.getComponentsDirPath()
    const components = discoverComponents(componentsDirPath)

    /**
     * Build entry file and components
     */
    const { buildManifest, builtFiles } = await buildEntryFileAndComponents(
      entryFilePath,
      components,
      outputDir,
      this.production,
      {
        ...buildOptions,
        watch: this.watch
          ? {
              onRebuild: (error) => {
                if (error) this.logger.error(`rebuilding the client failed`)
                else this.logger.success('successfully rebuilt the client')
              },
            }
          : false,
      }
    )

    /**
     * Empty the output directory
     */
    await emptyDir(outputDir)

    /**
     * Output built files
     */
    for (const [filePath, fileSource] of builtFiles) {
      /**
       * Does not work with the Generator API
       */
      outputFile(filePath, Buffer.from(await this.pluginsManager.execute('beforeOutput', fileSource, null)))
    }

    await this.pluginsManager.execute('afterOutput', null, builtFiles)

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

    /**
     * Output a log message after successful build
     * (substracting by one to exclude the entry file)
     */
    this.logger.success(`successfully built the client for ${Object.keys(buildManifest).length - 1} component(s)`)

    /**
     * Exit if not in watch mode
     */
    if (!this.watch) {
      this.exit()
    }
  }
}
