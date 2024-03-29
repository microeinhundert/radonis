/*
 * @microeinhundert/radonis-server
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { join } from 'node:path'

import type * as sinkStatic from '@adonisjs/sink'
import type { ApplicationContract } from '@ioc:Adonis/Core/Application'

/**
 * Returns absolute path to the stub relative
 * from the templates directory
 */
function getStub(...relativePaths: string[]) {
  return join(__dirname, 'templates', ...relativePaths)
}

/**
 * Creates the entry file
 */
async function createEntryFile(app: ApplicationContract, sink: typeof sinkStatic, projectRoot: string) {
  const resourcesDir = app.directoriesMap.get('resources') || 'resources'

  const entryFile = app.resourcesPath('entry.client.ts')
  const entryFileTemplate = new sink.files.MustacheFile(projectRoot, entryFile, getStub('entry.client.txt'))

  if (entryFileTemplate.exists()) {
    sink.logger.action('create').skipped(`${resourcesDir}/entry.client.ts`)
  } else {
    entryFileTemplate.apply({}).commit()
    sink.logger.action('create').succeeded(`${resourcesDir}/entry.client.ts`)
  }
}

/**
 * Installs packages
 */
async function installPackages(sink: typeof sinkStatic, projectRoot: string) {
  const packageJsonFile = new sink.files.PackageJsonFile(projectRoot)

  /**
   * Dependencies
   */
  packageJsonFile.install('@microeinhundert/radonis-unocss', '^2.1.5', false)
  packageJsonFile.install('@adonisjs/i18n', '^1.5.0', false)
  packageJsonFile.install('@adonisjs/session', '^6.4.0', false)
  packageJsonFile.install('react', '^18.2.0', false)
  packageJsonFile.install('react-dom', '^18.2.0', false)

  /**
   * Dev Dependencies
   */
  packageJsonFile.install('@types/react', '^18.0.0', true)
  packageJsonFile.install('@types/react-dom', '^18.0.0', true)
  packageJsonFile.install('concurrently', undefined, true)

  const spinner = sink.logger.await('Installing packages')

  try {
    await packageJsonFile.commitAsync()
    spinner.update('Packages installed')
  } catch (error) {
    spinner.update('Unable to install packages')
    sink.logger.fatal(error)
  }

  spinner.stop()
}

/**
 * Adds scripts
 */
async function addScripts(sink: typeof sinkStatic, projectRoot: string) {
  const packageJsonFile = new sink.files.PackageJsonFile(projectRoot)

  packageJsonFile.setScript('dev', "concurrently 'npm:dev:*'")
  packageJsonFile.setScript('dev:client', 'node ace build:client --watch')
  packageJsonFile.setScript('dev:server', 'node ace serve --watch')
  packageJsonFile.setScript('build', 'npm run build:server && npm run build:client')
  packageJsonFile.setScript('build:client', 'node ace build:client --production')
  packageJsonFile.setScript('build:server', 'node ace build --production')

  await packageJsonFile.commitAsync()
}

/**
 * Modifies tsconfig
 */
function modifyTsconfig(sink: typeof sinkStatic, projectRoot: string) {
  const tsConfigFile = new sink.files.JsonFile(projectRoot, 'tsconfig.json')

  tsConfigFile.set('compilerOptions.jsx', 'react-jsx')

  tsConfigFile.commit()
}

/**
 * Instructions to be executed when setting up the package
 */
export default async function instructions(projectRoot: string, app: ApplicationContract, sink: typeof sinkStatic) {
  createEntryFile(app, sink, projectRoot)

  try {
    await installPackages(sink, projectRoot)
    await addScripts(sink, projectRoot)
    modifyTsconfig(sink, projectRoot)
  } catch (error) {
    sink.logger.fatal(error)
  }
}
