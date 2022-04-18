/*
 * @microeinhundert/radonis-server
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { RadonisConfig } from '@ioc:Adonis/Addons/Radonis'
import { fsReadAll } from '@poppinss/utils/build/helpers'
import { build } from 'esbuild'
import { basename, join, parse } from 'path'

import { isFirstCharLowerCase } from './utils'

export class Compiler {
  /**
   * The compiled components
   */
  private compiledComponents: Map<string, { originalPath: string; path: string }> = new Map()

  /**
   * The required components
   */
  private requiredComponents = new Set<string>()

  /**
   * Constructor
   */
  constructor(private config: RadonisConfig) {}

  /**
   * Get the paths to all components inside the components directory
   */
  private discoverComponents(): string[] {
    return fsReadAll(this.config.componentsDir, (filePath) => {
      const fileName = basename(filePath)
      return fileName.endsWith('.tsx') && !fileName.endsWith('.server.tsx') && !isFirstCharLowerCase(fileName)
    }).map((path) => join(this.config.componentsDir, path))
  }

  /**
   * Compile all components
   */
  public async compileComponents(): Promise<void> {
    const components = this.discoverComponents()

    this.compiledComponents.clear()

    const { metafile } = await build({
      outdir: this.config.clientBundleOutputDir,
      entryPoints: components,
      platform: 'browser',
      format: 'esm',
      bundle: true,
      splitting: true,
      metafile: true,
      write: true,
      logLevel: 'silent',
      minify: this.config.productionMode,
      define: {
        'process.env.NODE_ENV': this.config.productionMode ? '"production"' : '"development"',
      },
    })

    for (const key in metafile.outputs) {
      const output = metafile.outputs[key]

      if (output.entryPoint) {
        const { name } = parse(output.entryPoint)

        this.compiledComponents.set(name, {
          originalPath: key,
          path: key.replace('public/', ''),
        })
      }
    }
  }

  /**
   * Require a component
   */
  public requireComponent(componentName: string): void {
    this.requiredComponents.add(componentName)
  }

  /**
   * Get the compiled component styles
   */
  public getComponentStyles(): string[] {
    return []
  }

  /**
   * Get the compiled component scripts
   */
  public getComponentScripts(): string[] {
    return Array.from(this.requiredComponents)
      .map((componentName) => {
        return this.compiledComponents.get(componentName)?.path ?? null
      })
      .filter((path): path is string => path !== null)
  }

  /**
   * Prepare for a new request
   */
  public prepareForNewRequest(): void {
    this.requiredComponents.clear()
  }
}
