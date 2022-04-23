import type { Loader } from 'esbuild'
import { extname } from 'path'

export const loaders: { [ext: string]: Loader } = {
  '.js': 'js',
  '.jsx': 'jsx',
  '.ts': 'ts',
  '.tsx': 'tsx',
}

export function getLoaderForFile(file: string): Loader {
  const ext = extname(file)
  if (ext in loaders) return loaders[ext]
  throw new Error(`Cannot get loader for file at "${file}"`)
}
