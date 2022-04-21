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
import { parse } from 'path'

import { loaders } from './loaders'
import { componentsPlugin } from './plugins'
import { discoverComponents } from './utils'

type Component = { originalPath: string; path: string }

export class Compiler {
  /**
   * The compiled components
   */
  private compiledComponents: Map<string, Component> = new Map()

  /**
   * The required components
   */
  private requiredComponents = new Set<string>()

  /**
   * Constructor
   */
  constructor(private config: RadonisConfig) {}

  /**
   * Compile all components
   */
  public async compileComponents(resolveDir: string): Promise<void> {
    const { productionMode, componentsDir, clientBundleOutputDir, buildOptions } = this.config
    const components = discoverComponents(componentsDir)

    await del(clientBundleOutputDir)
    this.compiledComponents.clear()

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
      external: ['@microeinhundert/radonis-manifest', ...(buildOptions.external ?? [])],
      plugins: [componentsPlugin(resolveDir, componentsDir), ...(buildOptions.plugins ?? [])],
      define: {
        'process.env.NODE_ENV': JSON.stringify(productionMode ? 'production' : 'development'),
        'isServer': 'false',
        ...(buildOptions.define ?? {}),
      },
    })

    for (const key in metafile!.outputs) {
      const output = metafile!.outputs[key]

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
   * Get the required, compiled component scripts
   */
  public getRequiredComponentScripts(): string[] {
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
