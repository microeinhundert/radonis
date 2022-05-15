/*
 * @microeinhundert/radonis-manifest
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { test } from '@japa/runner'

import { definePlugin, PluginsManager } from '../src/PluginsManager'

/**
 * Plugins Manager
 */
test.group('Plugins Manager', (group) => {
  let pluginsManager: PluginsManager

  group.each.setup(() => {
    pluginsManager = new PluginsManager()
  })

  test('installs plugin', ({ assert }) => {
    const testPlugin = definePlugin({
      name: 'test-plugin',
      environments: ['client'],
    })

    assert.doesNotThrows(() => pluginsManager.install('client', testPlugin))
  })

  test('throws if plugin is not supported in current environment', ({ assert }) => {
    const testPlugin = definePlugin({
      name: 'test-plugin',
      environments: ['client'],
    })

    assert.throws(
      () => pluginsManager.install('server', testPlugin),
      'The plugin "test-plugin" is not installable in the "server" environment'
    )
  })

  test('throws if two plugins conflict with each other', ({ assert }) => {
    const testPluginOne = definePlugin({
      name: 'test-plugin-1',
      environments: ['client'],
    })

    const testPluginTwo = definePlugin({
      name: 'test-plugin-2',
      conflictsWith: ['test-plugin-1'],
      environments: ['client'],
    })

    assert.throws(
      () => pluginsManager.install('client', testPluginOne, testPluginTwo),
      'The plugin "test-plugin-2" conflicts with the following installed plugins: test-plugin-1'
    )
  })

  test('throws if plugin was already installed', ({ assert }) => {
    const testPlugin = definePlugin({
      name: 'test-plugin',
      environments: ['server'],
    })

    assert.throws(
      () => pluginsManager.install('server', testPlugin, testPlugin),
      'The plugin "test-plugin" was already installed'
    )
  })
})
