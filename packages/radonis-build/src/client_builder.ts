/*
 * @microeinhundert/radonis-build
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { RadonisException } from '@microeinhundert/radonis-shared'
import { context } from 'esbuild'
import { emptyDir } from 'fs-extra'

import { E_CANNOT_BUILD_CLIENT } from './exceptions/cannot_build_client'
import { loaders } from './loaders'
import { assetsPlugin } from './plugins/assets'
import { clientPlugin } from './plugins/client'
import { islandsPlugin } from './plugins/islands'
import type { BuildOptions, OnBuildEndCallback } from './types/main'

/**
 * @internal
 */
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
    outputToDisk,
    outputForProduction,
    rebuildOnFileChanges,
    esbuildOptions,
  }: BuildOptions): Promise<void> {
    if (outputToDisk) {
      await emptyDir(outputPath)
    }

    /**
     * Initialize the build context
     */
    const buildContext = await context({
      platform: 'browser',
      metafile: true,
      bundle: true,
      splitting: true,
      treeShaking: true,
      format: 'esm',
      logLevel: 'silent',
      write: false,
      jsx: 'automatic',
      entryPoints,
      outbase: appRootPath,
      outdir: outputPath,
      minify: outputForProduction,
      ...esbuildOptions,
      plugins: [
        islandsPlugin(),
        clientPlugin(),
        assetsPlugin({
          publicPath,
          outputToDisk,
          onEnd: (builtAssets) => {
            this.#onBuildEndCallbacks.forEach((callback) => callback.apply(null, [builtAssets]))
          },
        }),
        ...(esbuildOptions?.plugins ?? []),
      ],
      loader: { ...loaders, ...(esbuildOptions?.loader ?? {}) },
      define: {
        ...this.#getEnvironment(),
        'process.env.NODE_ENV': outputForProduction ? '"production"' : '"development"',
        ...(esbuildOptions?.define ?? {}),
      },
    })

    try {
      if (rebuildOnFileChanges) {
        await buildContext.watch()
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
