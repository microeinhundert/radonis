/*
 * @microeinhundert/radonis-manifest
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { test } from '@japa/runner'
import superjson from 'superjson'

import { Builder } from '../src/Builder'
import { FlashMessagesManager } from '../src/FlashMessagesManager'
import { I18nManager } from '../src/I18nManager'
import { RoutesManager } from '../src/RoutesManager'
import { flashMessagesFixtureOne } from './fixtures/flashMessages'
import { globalsFixtureOne } from './fixtures/globals'
import { messagesFixtureOne } from './fixtures/messages'
import { propsFixtureOne, propsFixtureThree, propsFixtureTwo } from './fixtures/props'
import { routesFixtureOne } from './fixtures/routes'

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
    builder.addGlobals(globalsFixtureOne)
    assert.deepEqual(builder.globals, globalsFixtureOne)
  })

  test('clears globals on new request', ({ assert }) => {
    builder.addGlobals(globalsFixtureOne)
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

  group.each.setup(() => {
    flashMessagesManager = new FlashMessagesManager()
    i18nManager = new I18nManager()
    routesManager = new RoutesManager()
    builder = new Builder(flashMessagesManager, i18nManager, routesManager, {
      limitClientManifest: true,
    })
  })

  test('stores', ({ assert }) => {
    const propsHashOne = builder.registerProps('MyComponentOne', propsFixtureOne)
    assert.isString(propsHashOne)

    const propsHashTwo = builder.registerProps('MyComponentTwo', propsFixtureTwo)
    assert.isString(propsHashTwo)

    const propsHashThree = builder.registerProps('MyComponentThree', {})
    assert.isNull(propsHashThree)

    assert.deepEqual(builder.props, {
      [propsHashOne as string]: propsFixtureOne,
      [propsHashTwo as string]: propsFixtureTwo,
    })
  })

  test('clears on new request', ({ assert }) => {
    builder.registerProps('MyComponentOne', propsFixtureOne)
    builder.prepareForNewRequest()
    assert.deepEqual(builder.props, {})
  })

  test('does not throw if props contain non-serializable data', ({ assert }) => {
    assert.doesNotThrows(() => builder.registerProps('MyComponent', propsFixtureThree))
  })

  test('serializes the client manifest', ({ assert }) => {
    const propsHashOne = builder.registerProps('MyComponentOne', propsFixtureOne)
    const propsHashTwo = builder.registerProps('MyComponentTwo', propsFixtureTwo)

    assert.equal(
      builder.getClientManifestAsJSON(),
      JSON.stringify(
        {
          props: superjson.serialize({
            [propsHashOne as string]: propsFixtureOne,
            [propsHashTwo as string]: propsFixtureTwo,
          }),
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

  group.each.setup(() => {
    flashMessagesManager = new FlashMessagesManager()
    i18nManager = new I18nManager()
    routesManager = new RoutesManager()
    builder = new Builder(flashMessagesManager, i18nManager, routesManager, {
      limitClientManifest: true,
    })
    builder.setFlashMessages(flashMessagesFixtureOne)
  })

  test('stores and requires for hydration', ({ assert }) => {
    flashMessagesManager.requireFlashMessageForHydration('firstName')
    assert.deepEqual(builder.flashMessagesRequiredForHydration, {
      firstName: 'Error on field',
    })
    assert.deepEqual(builder.flashMessages, flashMessagesFixtureOne)
  })

  test('clears hydration requirements on new request', ({ assert }) => {
    flashMessagesManager.requireFlashMessageForHydration('firstName')
    builder.prepareForNewRequest()
    assert.deepEqual(builder.flashMessagesRequiredForHydration, {})
    assert.deepEqual(builder.flashMessages, flashMessagesFixtureOne)
  })

  test('serializes the client manifest', ({ assert }) => {
    flashMessagesManager.requireFlashMessageForHydration('*')
    assert.equal(
      builder.getClientManifestAsJSON(),
      JSON.stringify(
        {
          props: superjson.serialize({}),
          globals: {},
          flashMessages: flashMessagesFixtureOne,
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

  group.each.setup(() => {
    flashMessagesManager = new FlashMessagesManager()
    i18nManager = new I18nManager()
    routesManager = new RoutesManager()
    builder = new Builder(flashMessagesManager, i18nManager, routesManager, {
      limitClientManifest: true,
    })
    builder.setMessages(messagesFixtureOne)
  })

  test('stores and requires for hydration', ({ assert }) => {
    i18nManager.requireMessageForHydration('hello')
    i18nManager.requireMessageForHydration('shared.sidebar.signIn')
    assert.deepEqual(builder.messagesRequiredForHydration, {
      'hello': 'Hello { name }',
      'shared.sidebar.signIn': 'Sign In',
    })
    assert.deepEqual(builder.messages, messagesFixtureOne)
  })

  test('clears hydration requirements on new request', ({ assert }) => {
    i18nManager.requireMessageForHydration('hello')
    builder.prepareForNewRequest()
    assert.deepEqual(builder.messagesRequiredForHydration, {})
    assert.deepEqual(builder.messages, messagesFixtureOne)
  })

  test('serializes the client manifest', ({ assert }) => {
    i18nManager.requireMessageForHydration('*')
    assert.equal(
      builder.getClientManifestAsJSON(),
      JSON.stringify(
        {
          props: superjson.serialize({}),
          globals: {},
          flashMessages: {},
          locale: 'en',
          messages: messagesFixtureOne,
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

  group.each.setup(() => {
    flashMessagesManager = new FlashMessagesManager()
    i18nManager = new I18nManager()
    routesManager = new RoutesManager()
    builder = new Builder(flashMessagesManager, i18nManager, routesManager, {
      limitClientManifest: true,
    })
    builder.setRoutes(routesFixtureOne)
  })

  test('stores and requires for hydration', ({ assert }) => {
    routesManager.requireRouteForHydration('drive.local.serve')
    assert.deepEqual(builder.routesRequiredForHydration, {
      'drive.local.serve': '/uploads/*',
    })
    assert.deepEqual(builder.routes, routesFixtureOne)
  })

  test('clears hydration requirements on new request', ({ assert }) => {
    routesManager.requireRouteForHydration('drive.local.serve')
    builder.prepareForNewRequest()
    assert.deepEqual(builder.routesRequiredForHydration, {})
    assert.deepEqual(builder.routes, routesFixtureOne)
  })

  test('serializes the client manifest', ({ assert }) => {
    routesManager.requireRouteForHydration('*')
    assert.equal(
      builder.getClientManifestAsJSON(),
      JSON.stringify(
        {
          props: superjson.serialize({}),
          globals: {},
          flashMessages: {},
          locale: 'en',
          messages: {},
          routes: routesFixtureOne,
          route: null,
        },
        null,
        2
      )
    )
  })
})
