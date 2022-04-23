/*
 * @microeinhundert/radonis-server
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { RadonisConfig } from '@ioc:Adonis/Addons/Radonis'
import del from 'del'
import { build } from 'esbuild'
import { existsSync } from 'fs'
import { resolve } from 'path'

import { loaders } from './loaders'
import { componentsPlugin } from './plugins'
import { discoverComponents, extractEntryPoints, filterLastItem } from './utils'

type EntryPoints = Record<string, string>

export class Compiler {
  /**
   * The component entry points
   */
  private componentEntryPoints: EntryPoints = {}

  /**
   * The components required for hydration
   */
  private componentsRequiredForHydration: Set<string> = new Set()

  /**
   * Constructor
   */
  constructor(private config: RadonisConfig) {}

  /**
   * Clear the output directory
   */
  private async clearOutputDir(): Promise<void> {
    const {
      client: { outputDir },
    } = this.config

    await del(outputDir)
  }

  /**
   * Get the path to the entry file
   */
  private getEntryFilePath() {
    const {
      client: { rootDir, entryFile },
    } = this.config

    const entryFilePath = resolve(rootDir, entryFile)

    if (!existsSync(entryFilePath)) {
      throw new Error(`The client entry file does not exist at "${entryFilePath}"`)
    }

    return entryFilePath
  }

  /**
   * Get the path to the components directory
   */
  private getComponentsDirPath() {
    const {
      client: { rootDir, componentsDir },
    } = this.config

    const componentsDirPath = resolve(rootDir, componentsDir)

    if (!existsSync(componentsDirPath)) {
      throw new Error(`The client components directory does not exist at "${componentsDirPath}"`)
    }

    return componentsDirPath
  }

  /**
   * Compile all components
   */
  public async compileComponents(): Promise<void> {
    const {
      productionMode,
      client: { outputDir },
      buildOptions,
    } = this.config

    const componentsDir = this.getComponentsDirPath()
    const entryFile = this.getEntryFilePath()

    const components = discoverComponents(componentsDir)

    this.clearOutputDir()
    this.componentEntryPoints = {}

    const { metafile } = await build({
      outdir: outputDir,
      entryPoints: [...components, entryFile],
      metafile: true,
      write: true,
      bundle: true,
      splitting: true,
      treeShaking: true,
      platform: 'browser',
      format: 'esm',
      logLevel: 'silent',
      minify: productionMode,
      ...buildOptions,
      loader: { ...loaders, ...(buildOptions.loader ?? {}) },
      plugins: [componentsPlugin(componentsDir), ...(buildOptions.plugins ?? [])],
      external: [
        '@microeinhundert/radonis-manifest',
        '@microeinhundert/radonis-server',
        ...(buildOptions.external ?? []),
      ],
      define: {
        'process.env.NODE_ENV': JSON.stringify(productionMode ? 'production' : 'development'),
        ...(buildOptions.define ?? {}),
      },
    })

    this.componentEntryPoints = extractEntryPoints(metafile!)
  }

  /**
   * Get the component entry points
   */
  public getComponentEntryPoints(all?: boolean): EntryPoints {
    if (all) {
      return this.componentEntryPoints
    }

    const entryPoints = {} as EntryPoints

    for (const identifier of this.componentsRequiredForHydration) {
      if (identifier in this.componentEntryPoints) {
        entryPoints[identifier] = this.componentEntryPoints[identifier]
      }
    }

    return {
      ...entryPoints,
      ...filterLastItem(this.componentEntryPoints),
    }
  }

  /**
   * Require a component for hydration
   */
  public requireComponentForHydration(identifier: string): void {
    if (!(identifier in this.componentEntryPoints)) return
    this.componentsRequiredForHydration.add(identifier)
  }

  /**
   * Prepare for a new request
   */
  public prepareForNewRequest(): void {
    this.componentsRequiredForHydration.clear()
  }
}
