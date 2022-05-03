/*
 * @microeinhundert/radonis-server
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { isProduction } from '@microeinhundert/radonis-shared'
import type { BuildOptions, Metafile } from 'esbuild'
import { build } from 'esbuild'
import { join, parse } from 'path'

import { loaders } from './loaders'
import { radonisClientPlugin } from './plugins'

/**
 * Extract the entry points from an esbuild generated metafile
 */
function extractEntryPoints(metafile: Metafile): Radonis.BuildOutput {
  const entryPoints = {} as Radonis.BuildOutput

  for (let path in metafile.outputs) {
    const output = metafile.outputs[path]

    if (!output.entryPoint) {
      continue
    }

    const { name } = parse(output.entryPoint)

    entryPoints[name] = {
      publicPath: join('/', path.replace(/^public\//, '')),
    }
  }

  return entryPoints
}

/**
 * Build the entry file as well as the components
 */
export async function buildEntryFileAndComponents(
  entryFilePath: string,
  components: Radonis.Component[],
  outputDir: string,
  buildOptions: BuildOptions
): Promise<Radonis.BuildOutput> {
  const { metafile } = await build({
    entryPoints: [...components.map(({ path }) => path), entryFilePath],
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

  return extractEntryPoints(metafile!)
}
