/*
 * @microeinhundert/radonis-server
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { BaseCommand, flags } from '@adonisjs/ace'
import { files } from '@adonisjs/sink'
import type { RadonisConfig } from '@ioc:Microeinhundert/Radonis'
import type { BuildManifest } from '@microeinhundert/radonis-build'
import {
  buildEntryFileAndComponents,
  discoverComponents,
  generateAssetsManifest,
  writeBuildManifestToDisk,
} from '@microeinhundert/radonis-build'
import { invariant } from '@microeinhundert/radonis-shared'
import { generateAndWriteTypesToDisk } from '@microeinhundert/radonis-types'
import chokidar from 'chokidar'
import { existsSync } from 'fs'
import { parse, relative, resolve } from 'path'

import { extractRootRoutes } from '../src/utils/extractRootRoutes'

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
  public production: boolean | undefined

  /**
   * Allows watching a directory for file changes
   */
  @flags.string({ description: 'Directory to watch for changes' })
  public watchDir: string | undefined

  /**
   * Allows configuring the output directory
   */
  @flags.string({ description: 'Directory to output built files to' })
  public outputDir: 'tsconfig-out-dir' | string | undefined

  /**
   * Allows configuring the types output directory
   */
  @flags.string({ description: 'Directory to output generated types to' })
  public typesOutputDir: string | undefined

  /**
   * The Radonis config
   */
  private config: RadonisConfig = this.application.config.get('radonis', {})

  /**
   * The entry file path
   */
  private get entryFilePath(): string {
    let {
      client: { entryFile },
    } = this.config

    entryFile = yieldScriptPath(entryFile)

    invariant(existsSync(entryFile), `The Radonis entry file does not exist at "${entryFile}"`)

    return entryFile
  }

  /**
   * The components directory path
   */
  private get componentsDir(): string {
    const {
      client: { componentsDir },
    } = this.config

    invariant(existsSync(componentsDir), `The Radonis components directory does not exist at "${componentsDir}"`)

    return componentsDir
  }

  /**
   * The output directory path
   */
  private get environmentAwareOutputDir(): string {
    const {
      client: { outputDir },
    } = this.config

    if (!this.outputDir) {
      return outputDir
    }

    /**
     * Resolve path using outDir from tsconfig
     */
    if (this.outputDir === 'tsconfig-out-dir') {
      const tsConfig = new files.JsonFile(this.application.appRoot, 'tsconfig.json')
      const compilerOutDir = tsConfig.get('compilerOptions.outDir') || 'build'

      return resolve(this.application.appRoot, compilerOutDir, relative(this.application.appRoot, outputDir))
    }

    return resolve(this.application.appRoot, this.outputDir)
  }

  /**
   * Run the build
   */
  private async build(): Promise<BuildManifest> {
    const {
      client: { buildOptions },
    } = this.config

    const components = discoverComponents(this.componentsDir)

    const buildManifest = await buildEntryFileAndComponents(
      this.entryFilePath,
      components,
      this.environmentAwareOutputDir,
      !!this.production,
      buildOptions
    )

    /**
     * Write the build manifest
     */
    writeBuildManifestToDisk(buildManifest, this.environmentAwareOutputDir)

    /**
     * Output a log message after successful build
     * (substracting by one to exclude the entry file)
     */
    this.logger.success(`successfully built the client for ${Object.keys(buildManifest).length - 1} component(s)`)

    return buildManifest
  }

  /**
   * Generate TypeScript types for components, messages and routes
   */
  private async generateTypes(buildManifest: BuildManifest): Promise<void> {
    const Router = this.application.container.resolveBinding('Adonis/Core/Route')
    const I18n = this.application.container.resolveBinding('Adonis/Addons/I18n')

    Router.commit()

    /**
     * Do not generate types when no output dir is set
     */
    if (!this.typesOutputDir) {
      return
    }

    const assetsManifest = await generateAssetsManifest(buildManifest)

    /**
     * Generate and write types to disk
     */
    generateAndWriteTypesToDisk(
      {
        components: assetsManifest.filter(({ type }) => type === 'component').map(({ identifier }) => identifier),
        messages: Object.keys(I18n.getTranslationsFor(I18n.defaultLocale)),
        routes: Object.keys(extractRootRoutes(Router)),
      },
      resolve(this.application.appRoot, this.typesOutputDir)
    )

    /**
     * Output a log message after successful generation
     */
    this.logger.success('successfully generated types')
  }

  /**
   * Run the command
   */
  public async run(): Promise<void> {
    let buildManifest = await this.build()
    await this.generateTypes(buildManifest)

    if (this.watchDir) {
      /**
       * Initialize the watcher
       */
      const watcher = chokidar.watch(resolve(this.application.appRoot, this.watchDir), {
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
          buildManifest = await this.build()
          await this.generateTypes(buildManifest)
        })
    } else {
      this.exit()
    }
  }
}
