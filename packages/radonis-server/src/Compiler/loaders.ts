import type * as esbuild from 'esbuild'
import { extname } from 'path'

export const loaders: { [ext: string]: esbuild.Loader } = {
  '.aac': 'file',
  '.css': 'file',
  '.eot': 'file',
  '.flac': 'file',
  '.gif': 'file',
  '.ico': 'file',
  '.jpeg': 'file',
  '.jpg': 'file',
  '.js': 'jsx',
  '.jsx': 'jsx',
  '.json': 'json',
  '.mp3': 'file',
  '.mp4': 'file',
  '.ogg': 'file',
  '.otf': 'file',
  '.png': 'file',
  '.svg': 'file',
  '.ts': 'ts',
  '.tsx': 'tsx',
  '.ttf': 'file',
  '.wav': 'file',
  '.webm': 'file',
  '.webp': 'file',
  '.woff': 'file',
  '.woff2': 'file',
}

export function getLoaderForFile(file: string): esbuild.Loader {
  let ext = extname(file)
  if (ext in loaders) return loaders[ext]
  throw new Error(`Cannot get loader for file ${file}`)
}
