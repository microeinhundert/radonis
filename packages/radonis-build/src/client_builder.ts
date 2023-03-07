/*
 * @microeinhundert/radonis-build
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import EventEmitter from 'node:events'
import { rm } from 'node:fs/promises'

import { RadonisException } from '@microeinhundert/radonis-shared'
import { context } from 'esbuild'

import { E_CANNOT_BUILD_CLIENT } from './exceptions'
import { loaders } from './loaders'
import { RadonisPlugin } from './plugin'
import type { BuildOptions } from './types/main'

export class ClientBuilder extends EventEmitter {
  /**
   * Build the client
   */
  async build({
    entryPoints,
    appRootPath,
    publicPath,
    outputPath,
    outputForProduction,
    rebuildOnFileChanges,
    esbuildOptions,
  }: BuildOptions): Promise<void> {
    await rm(outputPath, { recursive: true, force: true })

    /**
     * Initialize the build context
     */
    const buildContext = await context({
      entryPoints,
      outbase: appRootPath,
      outdir: outputPath,
      bundle: true,
      splitting: true,
      metafile: true,
      write: false,
      treeShaking: outputForProduction,
      platform: 'browser',
      format: 'esm',
      logLevel: 'silent',
      jsx: 'automatic',
      plugins: [
        new RadonisPlugin({
          publicPath,
          minify: outputForProduction,
          onEnd: async (builtAssets) => {
            this.emit('end', builtAssets)
          },
        }),
        ...(esbuildOptions?.plugins ?? []),
      ],
      loader: { ...loaders, ...esbuildOptions?.loader },
      define: {
        ...this.#getEnvironment(),
        'process.env.NODE_ENV': outputForProduction ? '"production"' : '"development"',
        ...esbuildOptions?.define,
      },
    })

    try {
      if (rebuildOnFileChanges) {
        await buildContext.watch()
      } else {
        await buildContext.rebuild()
      }
    } catch (error) {
      buildContext.dispose()

      if (error instanceof RadonisException) {
        throw error
      }

      throw new E_CANNOT_BUILD_CLIENT([error instanceof Error ? error.message : 'Unknown error'])
    }
  }

  /**
   * Get environment related `define` entries for esbuild
   */
  #getEnvironment(): Record<string, string> {
    return Object.entries(process.env).reduce<Record<string, string>>((environment, [key, value]) => {
      if (!key.startsWith('PUBLIC_')) {
        return environment
      }

      return {
        ...environment,
        [`process.env.${key}`]: JSON.stringify(value),
      }
    }, {})
  }
}
