/*
 * @microeinhundert/radonis-server
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { RadonisConfig } from '@ioc:Adonis/Addons/Radonis'
import esbuild from 'esbuild'
import { dirname, parse } from 'path'

import { getLoaderForFile, loaders } from './loaders'
import { discoverComponents } from './utils'

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
   * Compile all components
   */
  public async compileComponents(resolveDir: string): Promise<void> {
    const { productionMode, clientBundleOutputDir, componentsDir } = this.config
    const components = discoverComponents(componentsDir)

    const testPlugin = {
      name: 'radonis-components',
      setup(build) {
        build.onResolve({ filter: /.*/ }, (args) => {
          if (args.path.startsWith(componentsDir)) {
            return { path: args.path, namespace: 'radonis-component' }
          }
        })

        build.onLoad({ filter: /.*/, namespace: 'radonis-component' }, ({ path }) => {
          console.log(dirname(path), resolveDir)

          const contents = `
            console.log('Test');
          `

          return {
            contents,
            resolveDir: dirname(path),
            loader: getLoaderForFile(path),
          }
        })
      },
    }

    const { metafile } = await esbuild.build({
      outdir: clientBundleOutputDir,
      entryPoints: components,
      platform: 'browser',
      format: 'esm',
      bundle: true,
      splitting: true,
      treeShaking: true,
      metafile: true,
      write: true,
      logLevel: 'silent',
      minify: productionMode,
      loader: loaders,
      external: ['@microeinhundert/radonis-server'],
      define: {
        'process.env.NODE_ENV': productionMode ? '"production"' : '"development"',
        'isServer': 'false',
      },
      plugins: [testPlugin],
    })

    this.compiledComponents.clear()

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
