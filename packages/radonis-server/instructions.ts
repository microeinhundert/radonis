/*
 * @microeinhundert/radonis-server
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type * as sinkStatic from '@adonisjs/sink'
import type { ApplicationContract } from '@ioc:Adonis/Core/Application'
import { existsSync, mkdirSync } from 'fs'
import { join } from 'path'

/**
 * Returns absolute path to the stub relative
 * from the templates directory
 */
function getStub(...relativePaths: string[]) {
  return join(__dirname, 'templates', ...relativePaths)
}

/**
 * Instructions to be executed when setting up the package
 */
export default async function instructions(projectRoot: string, app: ApplicationContract, sink: typeof sinkStatic) {
  const entryFilePath = app.resourcesPath('entry.client.ts')

  const entryFileTemplate = new sink.files.MustacheFile(projectRoot, entryFilePath, getStub('entry.client.txt'))

  if (entryFileTemplate.exists()) {
    const resourceDir = app.directoriesMap.get('resources') || 'resources'
    sink.logger.action('create').skipped(`${resourceDir}/entry.client.ts`)
  } else {
    entryFileTemplate.apply({}).commit()
    const resourceDir = app.directoriesMap.get('resources') || 'resources'
    sink.logger.action('create').succeeded(`${resourceDir}/entry.client.ts`)
  }

  if (!existsSync(app.resourcesPath('components'))) {
    mkdirSync(app.resourcesPath('components'), { recursive: true })
    const resourceDir = app.directoriesMap.get('resources') || 'resources'
    sink.logger.action('create').succeeded(`${resourceDir}/components`)
  }
}
