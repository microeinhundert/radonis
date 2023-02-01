/*
 * @microeinhundert/radonis-build
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { rm } from 'node:fs/promises'

import { RadonisException } from '@microeinhundert/radonis-shared'
import { context } from 'esbuild'

import { E_CANNOT_BUILD_CLIENT } from './exceptions/cannot_build_client'
import { loaders } from './loaders'
import { radonisPlugin } from './plugin'
import type { BuildOptions, OnBuildEndCallback } from './types/main'

export class ClientBuilder {
  /**
   * The registered `onBuildEnd` callbacks
   */
  #onBuildEndCallbacks: OnBuildEndCallback[]

  constructor() {
    this.#onBuildEndCallbacks = []
  }

  /**
   * Register a callback to be called when a build has ended
   */
  onBuildEnd(callback: OnBuildEndCallback): void {
    this.#onBuildEndCallbacks.push(callback)
  }

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
        ...(esbuildOptions?.plugins ?? []),
        radonisPlugin({
          publicPath,
          minify: outputForProduction,
          onEnd: async (builtAssets) => {
            await Promise.all(this.#onBuildEndCallbacks.map((callback) => callback.apply(null, [builtAssets])))
          },
        }),
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
