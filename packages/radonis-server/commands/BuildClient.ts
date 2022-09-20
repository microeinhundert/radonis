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
import { generateAndWriteTypeDeclarationFileToDisk } from '@microeinhundert/radonis-types'
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
   * Allows for automatically rebuilding the client on file changes
   */
  @flags.string({
    description: 'Glob pattern of files that should automatically trigger a rebuild',
    alias: 'watch-dir',
  })
  public watch: string | undefined

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
   * The components directory
   */
  private get componentsDir(): string {
    const {
      client: { componentsDir },
    } = this.config

    invariant(existsSync(componentsDir), `The Radonis components directory does not exist at "${componentsDir}"`)

    return componentsDir
  }

  /**
   * The output directory
   */
  private get outputDir(): string {
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
   * Run the build
   */
  private async build(): Promise<BuildManifest> {
    const {
      client: { buildOptions },
    } = this.config

    const components = discoverComponents(this.componentsDir)
    const publicDir = this.application.rcFile.directories.public || 'public'
    const buildManifest = await buildEntryFileAndComponents(
      this.entryFilePath,
      components,
      publicDir,
      this.outputDir,
      !!this.production,
      buildOptions
    )

    /**
     * Write the build manifest
     */
    await writeBuildManifestToDisk(buildManifest, this.outputDir)

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
    /**
     * Do not generate types when building for production
     */
    if (this.production) {
      return
    }

    const Router = this.application.container.resolveBinding('Adonis/Core/Route')
    const I18n = this.application.container.resolveBinding('Adonis/Addons/I18n')

    await I18n.reloadTranslations()
    Router.commit()

    const assetsManifest = await generateAssetsManifest(buildManifest)

    try {
      await generateAndWriteTypeDeclarationFileToDisk(
        {
          components: assetsManifest.filter(({ type }) => type === 'component').map(({ identifier }) => identifier),
          messages: Object.keys(I18n.getTranslationsFor(I18n.defaultLocale)),
          routes: Object.keys(extractRootRoutes(Router)),
        },
        this.application.tmpPath('types')
      )

      this.logger.success('successfully generated types')
    } catch {
      this.logger.error('error generating types')
    }
  }

  /**
   * Run the command
   */
  public async run(): Promise<void> {
    let buildManifest = await this.build()
    await this.generateTypes(buildManifest)

    if (this.watch && !this.production) {
      /**
       * Initialize the watcher
       */
      const watcher = chokidar.watch(resolve(this.application.appRoot, this.watch), {
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
