/*
 * @microeinhundert/radonis-server
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { test } from '@japa/runner'
import type { Plugin } from '@microeinhundert/radonis-types'

import { PluginsManager } from '../src/services/plugins_manager'

/**
 * Plugins Manager
 */
test.group('Plugins Manager', (group) => {
  let pluginsManager: PluginsManager

  group.each.setup(() => {
    pluginsManager = new PluginsManager()
  })

  test('installs plugin', ({ assert }) => {
    const testPlugin: Plugin = {
      name: 'test-plugin',
      environments: ['client'],
    }

    assert.doesNotThrows(() => pluginsManager.install('client', testPlugin))
  })

  test('throws if plugin is not supported in current environment', ({ assert }) => {
    const testPlugin: Plugin = {
      name: 'test-plugin',
      environments: ['client'],
    }

    assert.throws(
      () => pluginsManager.install('server', testPlugin),
      'The plugin "test-plugin" is not installable in the "server" environment'
    )
  })

  test('throws if two plugins conflict with each other', ({ assert }) => {
    const testPluginOne: Plugin = {
      name: 'test-plugin-1',
      conflictsWith: ['test-plugin-2'],
      environments: ['client'],
    }

    const testPluginTwo: Plugin = {
      name: 'test-plugin-2',
      conflictsWith: ['test-plugin-1'],
      environments: ['client'],
    }

    assert.throws(
      () => pluginsManager.install('client', testPluginOne, testPluginTwo),
      'The plugin "test-plugin-1" conflicts with the following installed plugins: test-plugin-2'
    )
  })

  test('throws if plugin is already installed', ({ assert }) => {
    const testPlugin: Plugin = {
      name: 'test-plugin',
      environments: ['server'],
    }

    assert.throws(
      () => pluginsManager.install('server', testPlugin, testPlugin),
      'The plugin "test-plugin" is already installed'
    )
  })
})
