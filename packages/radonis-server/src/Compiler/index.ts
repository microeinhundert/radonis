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
import esbuild from 'esbuild'

import { loaders } from './loaders'
import { componentsPlugin } from './plugins'
import { discoverComponents, extractEntryPoints } from './utils'

type EntryPoints = Record<string, string>

export class Compiler {
  /**
   * The entry points
   */
  private entryPoints: EntryPoints = {}

  /**
   * The required components
   */
  private requiredComponents = new Set<string>()

  /**
   * Constructor
   */
  constructor(private config: RadonisConfig) {}

  /**
   * Clear the output directory
   */
  private async clearOutputDir(): Promise<void> {
    const { clientBundleOutputDir } = this.config

    await del(clientBundleOutputDir)
  }

  /**
   * Compile all components
   */
  public async compileComponents(): Promise<void> {
    const { productionMode, componentsDir, clientBundleOutputDir, buildOptions } = this.config
    const components = discoverComponents(componentsDir)

    this.clearOutputDir()
    this.entryPoints = {}

    const { metafile } = await esbuild.build({
      outdir: clientBundleOutputDir,
      entryPoints: components,
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

    this.entryPoints = extractEntryPoints(metafile!)
  }

  /**
   * Require a component
   */
  public requireComponent(componentName: string): void {
    this.requiredComponents.add(componentName)
  }

  /**
   * Get the entry points of required components
   */
  public getRequiredEntryPoints(): EntryPoints {
    const entryPoints: EntryPoints = {}

    this.requiredComponents.forEach((componentName) => {
      let entryPoint = this.entryPoints[componentName]

      if (entryPoint) {
        /**
         * TODO: Remove this hack
         */
        if (entryPoint.startsWith('public')) {
          entryPoint = entryPoint.replace('public', '')
        }

        entryPoints[componentName] = entryPoint
      }
    })

    return entryPoints
  }

  /**
   * Prepare for a new request
   */
  public prepareForNewRequest(): void {
    this.requiredComponents.clear()
  }
}
