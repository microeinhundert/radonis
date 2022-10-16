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
import { build, discoverComponents, generateAssetsManifest } from '@microeinhundert/radonis-build'
import { generateAndWriteTypeDeclarationFileToDisk } from '@microeinhundert/radonis-types'
import { existsSync } from 'fs'

import { ServerException } from '../src/exceptions/serverException'
import { extractRootRoutes } from '../src/utils/extractRootRoutes'
import { yieldScriptPath } from '../src/utils/yieldScriptPath'

/**
 * A command to generate the types
 */
export default class GenerateTypes extends BaseCommand {
  static commandName = 'generate:types'
  static description = 'Generate the Radonis types'
  static settings = {
    loadApp: true,
    stayAlive: false,
  }

  /**
   * The Radonis config
   */
  #config: RadonisConfig = this.application.config.get('radonis', {})

  /**
   * The entry file path
   */
  get #entryFilePath(): string {
    let {
      client: { entryFile },
    } = this.#config

    entryFile = yieldScriptPath(entryFile)

    if (!existsSync(entryFile)) {
      throw ServerException.missingClientEntryFile(entryFile)
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
      throw ServerException.missingComponentsDirectory(componentsDir)
    }

    return componentsDir
  }

  /**
   * The output directory
   */
  get #outputDir(): string {
    return this.application.publicPath('radonis')
  }

  /**
   * Generate TypeScript types for components, messages and routes
   */
  async #generateTypes(): Promise<void> {
    const {
      client: { buildOptions },
    } = this.#config

    const Router = this.application.container.resolveBinding('Adonis/Core/Route')
    const I18n = this.application.container.resolveBinding('Adonis/Addons/I18n')

    Router.commit()

    const publicPath = this.application.rcFile.directories.public || 'public'

    /**
     * Execute the build
     */
    const buildManifest = await build({
      entryFilePath: this.#entryFilePath,
      entryPoints: discoverComponents(this.#componentsDir),
      publicPath,
      outputDir: this.#outputDir,
      esbuildOptions: buildOptions,
    })

    await generateAssetsManifest(buildManifest)

    try {
      await generateAndWriteTypeDeclarationFileToDisk(
        {
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
  async run(): Promise<void> {
    await this.#generateTypes()
  }
}
