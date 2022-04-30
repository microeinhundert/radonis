/*
 * @microeinhundert/radonis-server
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { RadonisConfig } from '@ioc:Adonis/Addons/Radonis'
import { isProduction } from '@microeinhundert/radonis-shared'
import { build } from 'esbuild'
import { existsSync } from 'fs'
import { basename } from 'path'
import invariant from 'tiny-invariant'

import { loaders } from './loaders'
import { radonisClientPlugin } from './plugins'
import { discoverComponents, extractEntryPoints, yieldScriptPath } from './utils'

type EntryPoints = Record<string, string>

export class Compiler {
  /**
   * The entry points
   */
  private entryPoints: EntryPoints = {}

  /**
   * The components required for hydration
   */
  private componentsRequiredForHydration: Set<string> = new Set()

  /**
   * Constructor
   */
  constructor(private config: RadonisConfig) {}

  /**
   * Get the path to the entry file
   */
  private getEntryFile() {
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
  private getComponentsDir() {
    const {
      client: { componentsDir },
    } = this.config

    invariant(existsSync(componentsDir), `The Radonis components directory does not exist at "${componentsDir}"`)

    return componentsDir
  }

  /**
   * Compile all components
   */
  public async compileComponents(): Promise<void> {
    const {
      client: { outputDir, buildOptions },
    } = this.config

    const componentsDir = this.getComponentsDir()
    const entryFile = this.getEntryFile()

    const components = discoverComponents(componentsDir)

    const { metafile } = await build({
      entryPoints: [...components, entryFile],
      outdir: outputDir,
      metafile: true,
      write: false,
      bundle: true,
      splitting: true,
      treeShaking: true,
      platform: 'browser',
      format: 'esm',
      logLevel: 'silent',
      minify: isProduction,
      ...buildOptions,
      loader: { ...loaders, ...(buildOptions.loader ?? {}) },
      plugins: [radonisClientPlugin(components, outputDir), ...(buildOptions.plugins ?? [])],
      external: [
        '@microeinhundert/radonis-manifest',
        '@microeinhundert/radonis-server',
        ...(buildOptions.external ?? []),
      ],
      define: {
        'process.env.NODE_ENV': isProduction ? '"production"' : '"development"',
        ...(buildOptions.define ?? {}),
      },
    })

    this.entryPoints = extractEntryPoints(metafile!)
  }

  /**
   * Get the entry points
   */
  public getEntryPoints(): string[] {
    const entryPoints = new Map<string, string>()

    /**
     * Add components required for hydration
     */
    for (const identifier of this.componentsRequiredForHydration) {
      if (identifier in this.entryPoints) {
        entryPoints.set(identifier, this.entryPoints[identifier])
      }
    }

    /**
     * Add entry
     */
    const entryFileName = basename(this.getEntryFile())
    for (const identifier in this.entryPoints) {
      if (entryFileName.startsWith(identifier)) {
        entryPoints.set(identifier, this.entryPoints[identifier])
        break
      }
    }

    return Array.from(entryPoints.values())
  }

  /**
   * Require a component for hydration
   */
  public requireComponentForHydration(identifier: string): void {
    if (!(identifier in this.entryPoints)) return
    this.componentsRequiredForHydration.add(identifier)
  }

  /**
   * Prepare for a new request
   */
  public prepareForNewRequest(): void {
    this.componentsRequiredForHydration.clear()
  }
}
