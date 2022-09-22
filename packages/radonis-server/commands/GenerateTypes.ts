/*
 * @microeinhundert/radonis-server
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { BaseCommand } from '@adonisjs/ace'
import type { RadonisConfig } from '@ioc:Microeinhundert/Radonis'
import { buildEntryFileAndComponents, discoverComponents, generateAssetsManifest } from '@microeinhundert/radonis-build'
import { invariant } from '@microeinhundert/radonis-shared'
import { generateAndWriteTypeDeclarationFileToDisk } from '@microeinhundert/radonis-types'
import { existsSync } from 'fs'

import { extractRootRoutes } from '../src/utils/extractRootRoutes'
import { yieldScriptPath } from '../src/utils/yieldScriptPath'

/**
 * A command to generate the types
 */
export default class GenerateTypes extends BaseCommand {
  public static commandName = 'generate:types'
  public static description = 'Generate the Radonis types'
  public static settings = {
    loadApp: true,
    stayAlive: false,
  }

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
    return this.application.publicPath('radonis')
  }

  /**
   * Generate TypeScript types for components, messages and routes
   */
  private async generateTypes(): Promise<void> {
    const {
      client: { buildOptions },
    } = this.config

    const Router = this.application.container.resolveBinding('Adonis/Core/Route')
    const I18n = this.application.container.resolveBinding('Adonis/Addons/I18n')

    Router.commit()

    const components = discoverComponents(this.componentsDir)
    const publicDir = this.application.rcFile.directories.public || 'public'
    const buildManifest = await buildEntryFileAndComponents({
      entryFilePath: this.entryFilePath,
      components,
      publicDir,
      outputDir: this.outputDir,
      esbuildOptions: buildOptions,
    })

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
    await this.generateTypes()
  }
}
