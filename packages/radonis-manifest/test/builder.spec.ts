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

/**
 * Globals
 */
test.group('Globals', (group) => {
  let flashMessagesManager: FlashMessagesManager
  let i18nManager: I18nManager
  let routesManager: RoutesManager
  let builder: Builder

  group.each.setup(() => {
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

  test('clears globals on new request', ({ assert }) => {
    const data = { lorem: 'ipsum', test: 123, hello: { to: 'world' } }

    builder.addGlobals(data)
    builder.prepareForNewRequest()
    assert.deepEqual(builder.globals, {})
  })
})

/**
 * Props
 */
test.group('Props', (group) => {
  let flashMessagesManager: FlashMessagesManager
  let i18nManager: I18nManager
  let routesManager: RoutesManager
  let builder: Builder

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

  group.each.setup(() => {
    flashMessagesManager = new FlashMessagesManager()
    i18nManager = new I18nManager()
    routesManager = new RoutesManager()
    builder = new Builder(flashMessagesManager, i18nManager, routesManager, {
      limitClientManifest: true,
    })
  })

  test('stores', ({ assert }) => {
    const propsHashOne = builder.registerProps('MyComponentOne', data) as string
    assert.isString(propsHashOne)

    const propsHashTwo = builder.registerProps('MyComponentTwo', data) as string
    assert.isString(propsHashTwo)

    const propsHashThree = builder.registerProps('MyComponentThree', {}) as null
    assert.isNull(propsHashThree)

    assert.deepEqual(builder.props, { [propsHashOne]: data, [propsHashTwo]: data })
  })

  test('clears on new request', ({ assert }) => {
    builder.registerProps('MyComponentOne', data) as string
    builder.prepareForNewRequest()
    assert.deepEqual(builder.props, {})
  })

  test('throws if not serializable', ({ assert }) => {
    assert.throws(
      () => builder.registerProps('MyComponent', { ...data, nonSerializableProp: BigInt(1) }),
      'The props passed to the component "MyComponent" are not serializable'
    )
  })

  test('serializes the client manifest', ({ assert }) => {
    const propsHashOne = builder.registerProps('MyComponentOne', data) as string
    assert.isString(propsHashOne)

    const propsHashTwo = builder.registerProps('MyComponentTwo', data) as string
    assert.isString(propsHashTwo)

    assert.equal(
      builder.getClientManifestAsJSON(),
      JSON.stringify(
        {
          props: { [propsHashOne]: data, [propsHashTwo]: data },
          globals: {},
          flashMessages: {},
          locale: 'en',
          messages: {},
          routes: {},
          route: null,
        },
        null,
        2
      )
    )
  })
})

/**
 * Flash Messages
 */
test.group('Flash Messages', (group) => {
  let flashMessagesManager: FlashMessagesManager
  let i18nManager: I18nManager
  let routesManager: RoutesManager
  let builder: Builder

  const data = {
    firstName: 'Error on field',
    welcome: 'Welcome to AdonisJS + Radonis!',
  }

  group.each.setup(() => {
    flashMessagesManager = new FlashMessagesManager()
    i18nManager = new I18nManager()
    routesManager = new RoutesManager()
    builder = new Builder(flashMessagesManager, i18nManager, routesManager, {
      limitClientManifest: true,
    })
    builder.setFlashMessages(data)
  })

  test('stores and requires for hydration', ({ assert }) => {
    assert.deepEqual(builder.flashMessagesRequiredForHydration, {})
    flashMessagesManager.requireFlashMessageForHydration('firstName')
    assert.deepEqual(builder.flashMessagesRequiredForHydration, {
      firstName: 'Error on field',
    })
    assert.deepEqual(builder.flashMessages, data)
  })

  test('clears hydration requirements on new request', ({ assert }) => {
    flashMessagesManager.requireFlashMessageForHydration('firstName')
    builder.prepareForNewRequest()
    assert.deepEqual(builder.flashMessagesRequiredForHydration, {})
    assert.deepEqual(builder.flashMessages, data)
  })

  test('serializes the client manifest', ({ assert }) => {
    flashMessagesManager.requireFlashMessageForHydration('*')

    assert.equal(
      builder.getClientManifestAsJSON(),
      JSON.stringify(
        {
          props: {},
          globals: {},
          flashMessages: data,
          locale: 'en',
          messages: {},
          routes: {},
          route: null,
        },
        null,
        2
      )
    )
  })
})

/**
 * I18n
 */
test.group('I18n', (group) => {
  let flashMessagesManager: FlashMessagesManager
  let i18nManager: I18nManager
  let routesManager: RoutesManager
  let builder: Builder

  const data = {
    'hello': 'Hello { name }',
    'shared.sidebar.signOut': 'Sign Out',
    'shared.sidebar.signIn': 'Sign In',
  }

  group.each.setup(() => {
    flashMessagesManager = new FlashMessagesManager()
    i18nManager = new I18nManager()
    routesManager = new RoutesManager()
    builder = new Builder(flashMessagesManager, i18nManager, routesManager, {
      limitClientManifest: true,
    })
    builder.setMessages(data)
  })

  test('stores and requires for hydration', ({ assert }) => {
    assert.deepEqual(builder.messagesRequiredForHydration, {})
    i18nManager.requireMessageForHydration('hello')
    i18nManager.requireMessageForHydration('shared.sidebar.signIn')
    assert.deepEqual(builder.messagesRequiredForHydration, {
      'hello': 'Hello { name }',
      'shared.sidebar.signIn': 'Sign In',
    })
    assert.deepEqual(builder.messages, data)
  })

  test('clears hydration requirements on new request', ({ assert }) => {
    i18nManager.requireMessageForHydration('hello')
    builder.prepareForNewRequest()
    assert.deepEqual(builder.messagesRequiredForHydration, {})
    assert.deepEqual(builder.messages, data)
  })

  test('serializes the client manifest', ({ assert }) => {
    i18nManager.requireMessageForHydration('*')

    assert.equal(
      builder.getClientManifestAsJSON(),
      JSON.stringify(
        {
          props: {},
          globals: {},
          flashMessages: {},
          locale: 'en',
          messages: data,
          routes: {},
          route: null,
        },
        null,
        2
      )
    )
  })
})

/**
 * Routes
 */
test.group('Routes', (group) => {
  let flashMessagesManager: FlashMessagesManager
  let i18nManager: I18nManager
  let routesManager: RoutesManager
  let builder: Builder

  const data = {
    'drive.local.serve': '/uploads/*',
    'home': '/',
    'dashboard': '/dashboard',
  }

  group.each.setup(() => {
    flashMessagesManager = new FlashMessagesManager()
    i18nManager = new I18nManager()
    routesManager = new RoutesManager()
    builder = new Builder(flashMessagesManager, i18nManager, routesManager, {
      limitClientManifest: true,
    })
    builder.setRoutes(data)
  })

  test('stores and requires for hydration', ({ assert }) => {
    assert.deepEqual(builder.routesRequiredForHydration, {})
    routesManager.requireRouteForHydration('drive.local.serve')
    assert.deepEqual(builder.routesRequiredForHydration, {
      'drive.local.serve': '/uploads/*',
    })
    assert.deepEqual(builder.routes, data)
  })

  test('clears hydration requirements on new request', ({ assert }) => {
    routesManager.requireRouteForHydration('drive.local.serve')
    builder.prepareForNewRequest()
    assert.deepEqual(builder.routesRequiredForHydration, {})
    assert.deepEqual(builder.routes, data)
  })

  test('serializes the client manifest', ({ assert }) => {
    routesManager.requireRouteForHydration('*')

    assert.equal(
      builder.getClientManifestAsJSON(),
      JSON.stringify(
        {
          props: {},
          globals: {},
          flashMessages: {},
          locale: 'en',
          messages: {},
          routes: data,
          route: null,
        },
        null,
        2
      )
    )
  })
})
