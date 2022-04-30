import type { Loader } from 'esbuild'
import { extname } from 'path'
import invariant from 'tiny-invariant'

export const loaders: { [ext: string]: Loader } = {
  '.js': 'js',
  '.jsx': 'jsx',
  '.ts': 'ts',
  '.tsx': 'tsx',
}

export function getLoaderForFile(file: string): Loader {
  const ext = extname(file)

  invariant(ext in loaders, `Cannot get loader for file at "${file}"`)

  return loaders[ext]
}
