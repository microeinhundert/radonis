/*
 * @microeinhundert/radonis-manifest
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { test } from '@japa/runner'

import { Builder } from '../src/Builder'
import { FlashMessagesManager } from '../src/FlashMessagesManager'
import { I18nManager } from '../src/I18nManager'
import { RoutesManager } from '../src/RoutesManager'

test.group('General', (group) => {
  let flashMessagesManager: FlashMessagesManager
  let i18nManager: I18nManager
  let routesManager: RoutesManager
  let builder: Builder

  group.each.setup(async () => {
    flashMessagesManager = new FlashMessagesManager()
    i18nManager = new I18nManager()
    routesManager = new RoutesManager()
    builder = new Builder(flashMessagesManager, i18nManager, routesManager, {
      limitClientManifest: true,
    })
  })

  test('stores globals', ({ assert }) => {
    const data = { lorem: 'ipsum', test: 123, hello: { to: 'world' } }

    builder.addGlobals(data)
    assert.deepEqual(builder.globals, data)
  })

  test('resets globals on new request', ({ assert }) => {
    const data = { lorem: 'ipsum', test: 123, hello: { to: 'world' } }

    builder.addGlobals(data)
    builder.prepareForNewRequest()
    assert.deepEqual(builder.globals, {})
  })

  test('stores props', ({ assert }) => {
    const data = {
      stringProp: 'hello world',
      numericProp: 123,
      arrayProp: [1, 2, 3],
      objectProp: {
        stringProp: 'hello world',
        numericProp: 123,
        arrayProp: [1, 2, 3],
      },
      dateProp: new Date(),
    }

    const propsHashOne = builder.registerProps('MyComponentOne', data) as string
    const propsHashTwo = builder.registerProps('MyComponentTwo', data) as string
    const propsHashThree = builder.registerProps('MyComponentThree', {}) as null

    assert.isString(propsHashOne)
    assert.isString(propsHashTwo)
    assert.isNull(propsHashThree)
    assert.deepEqual(builder.props, { [propsHashOne]: data, [propsHashTwo]: data })
    builder.prepareForNewRequest()
    assert.deepEqual(builder.props, {})
  })

  test('throws if props are not serializable', ({ assert }) => {
    const data = {
      stringProp: 'hello world',
      numericProp: 123,
      arrayProp: [1, 2, 3],
      bigIntProp: BigInt(1),
    }

    assert.throws(
      () => builder.registerProps('MyComponent', data),
      'The props passed to the component "MyComponent" are not serializable'
    )
  })
})

test.group('Flash Messages', (group) => {
  let flashMessagesManager: FlashMessagesManager
  let i18nManager: I18nManager
  let routesManager: RoutesManager
  let builder: Builder

  group.each.setup(async () => {
    flashMessagesManager = new FlashMessagesManager()
    i18nManager = new I18nManager()
    routesManager = new RoutesManager()
    builder = new Builder(flashMessagesManager, i18nManager, routesManager, {
      limitClientManifest: true,
    })
  })

  test('stores and requires for hydration', ({ assert }) => {
    const data = {
      firstName: 'Error on field',
      welcome: 'Welcome to AdonisJS + Radonis!',
    }

    builder.setFlashMessages(data)
    assert.deepEqual(builder.flashMessagesRequiredForHydration, {})
    flashMessagesManager.requireFlashMessageForHydration('firstName')
    assert.deepEqual(builder.flashMessagesRequiredForHydration, {
      firstName: 'Error on field',
    })
    assert.deepEqual(builder.flashMessages, data)
  })

  test('resets hydration requirements on new request', ({ assert }) => {
    const data = {
      firstName: 'Error on field',
      welcome: 'Welcome to AdonisJS + Radonis!',
    }

    builder.setFlashMessages(data)
    flashMessagesManager.requireFlashMessageForHydration('firstName')
    builder.prepareForNewRequest()
    assert.deepEqual(builder.flashMessagesRequiredForHydration, {})
    assert.deepEqual(builder.flashMessages, data)
  })
})

test.group('I18n', (group) => {
  let flashMessagesManager: FlashMessagesManager
  let i18nManager: I18nManager
  let routesManager: RoutesManager
  let builder: Builder

  group.each.setup(async () => {
    flashMessagesManager = new FlashMessagesManager()
    i18nManager = new I18nManager()
    routesManager = new RoutesManager()
    builder = new Builder(flashMessagesManager, i18nManager, routesManager, {
      limitClientManifest: true,
    })
  })

  test('stores and requires for hydration', ({ assert }) => {
    const data = {
      'hello': 'Hello { name }',
      'shared.sidebar.signOut': 'Sign Out',
      'shared.sidebar.signIn': 'Sign In',
    }

    builder.setMessages(data)
    assert.deepEqual(builder.messagesRequiredForHydration, {})
    i18nManager.requireMessageForHydration('hello')
    i18nManager.requireMessageForHydration('shared.sidebar.signIn')
    assert.deepEqual(builder.messagesRequiredForHydration, {
      'hello': 'Hello { name }',
      'shared.sidebar.signIn': 'Sign In',
    })
    assert.deepEqual(builder.messages, data)
  })

  test('resets hydration requirements on new request', ({ assert }) => {
    const data = {
      'hello': 'Hello { name }',
      'shared.sidebar.signOut': 'Sign Out',
      'shared.sidebar.signIn': 'Sign In',
    }

    builder.setMessages(data)
    i18nManager.requireMessageForHydration('hello')
    builder.prepareForNewRequest()
    assert.deepEqual(builder.messagesRequiredForHydration, {})
    assert.deepEqual(builder.messages, data)
  })
})

test.group('Routes', (group) => {
  let flashMessagesManager: FlashMessagesManager
  let i18nManager: I18nManager
  let routesManager: RoutesManager
  let builder: Builder

  group.each.setup(async () => {
    flashMessagesManager = new FlashMessagesManager()
    i18nManager = new I18nManager()
    routesManager = new RoutesManager()
    builder = new Builder(flashMessagesManager, i18nManager, routesManager, {
      limitClientManifest: true,
    })
  })

  test('stores and requires for hydration', ({ assert }) => {
    const data = {
      'drive.local.serve': '/uploads/*',
      'home': '/',
      'dashboard': '/dashboard',
    }

    builder.setRoutes(data)
    assert.deepEqual(builder.routesRequiredForHydration, {})
    routesManager.requireRouteForHydration('drive.local.serve')
    assert.deepEqual(builder.routesRequiredForHydration, {
      'drive.local.serve': '/uploads/*',
    })
    assert.deepEqual(builder.routes, data)
  })

  test('resets hydration requirements on new request', ({ assert }) => {
    const data = {
      'drive.local.serve': '/uploads/*',
      'home': '/',
      'dashboard': '/dashboard',
    }

    builder.setRoutes(data)
    routesManager.requireRouteForHydration('drive.local.serve')
    builder.prepareForNewRequest()
    assert.deepEqual(builder.routesRequiredForHydration, {})
    assert.deepEqual(builder.routes, data)
  })
})
