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
 * Creates the entry file
 */
async function createEntryFile(app: ApplicationContract, sink: typeof sinkStatic, projectRoot: string) {
  const resourceDir = app.directoriesMap.get('resources') || 'resources'

  const entryFilePath = app.resourcesPath('entry.client.ts')
  const entryFileTemplate = new sink.files.MustacheFile(projectRoot, entryFilePath, getStub('entry.client.txt'))

  if (entryFileTemplate.exists()) {
    sink.logger.action('create').skipped(`${resourceDir}/entry.client.ts`)
  } else {
    entryFileTemplate.apply({}).commit()
    sink.logger.action('create').succeeded(`${resourceDir}/entry.client.ts`)
  }
}

/**
 * Creates the components directory
 */
async function createComponentsDir(app: ApplicationContract, sink: typeof sinkStatic) {
  if (existsSync(app.resourcesPath('components'))) {
    return
  }

  const resourceDir = app.directoriesMap.get('resources') || 'resources'

  mkdirSync(app.resourcesPath('components'), { recursive: true })
  sink.logger.action('create').succeeded(`${resourceDir}/components`)
}

/**
 * Installs packages
 */
async function installPackages(sink: typeof sinkStatic, projectRoot: string) {
  const packageJsonFile = new sink.files.PackageJsonFile(projectRoot)

  /**
   * Dependencies
   */
  packageJsonFile.install('@microeinhundert/radonis-unocss', '^1.6.4', false)
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

  const logLines = [`Installing: ${sink.logger.colors.gray(packageJsonFile.getInstalls().list.join(', '))}`]
  const spinner = sink.logger.await(logLines.join(' '))

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
  packageJsonFile.setScript(
    'dev:client',
    "node ace build:client --types-output-dir './tmp/types' --watch-dir './resources/!(views)/**/*.ts(x)?'"
  )
  packageJsonFile.setScript('dev:server', 'node ace serve --watch')
  packageJsonFile.setScript('build', "concurrently 'npm:build:*'")
  packageJsonFile.setScript('build:client', 'node ace build:client --production --output-dir tsconfig-out-dir')
  packageJsonFile.setScript('build:server', 'node ace build --production')

  await packageJsonFile.commitAsync()
}

/**
 * Modifies tsconfig
 */
function modifyTsconfig(sink: typeof sinkStatic, projectRoot: string) {
  const tsConfigFile = new sink.files.JsonFile(projectRoot, 'tsconfig.json')

  tsConfigFile.set('compilerOptions.jsx', 'react')

  tsConfigFile.commit()
}

/**
 * Instructions to be executed when setting up the package
 */
export default async function instructions(projectRoot: string, app: ApplicationContract, sink: typeof sinkStatic) {
  createEntryFile(app, sink, projectRoot)
  createComponentsDir(app, sink)

  try {
    await installPackages(sink, projectRoot)
    await addScripts(sink, projectRoot)
    modifyTsconfig(sink, projectRoot)
  } catch (error) {
    sink.logger.fatal(error)
  }
}
