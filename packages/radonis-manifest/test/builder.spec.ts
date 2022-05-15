/*
 * @microeinhundert/radonis-manifest
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { test } from '@japa/runner'

import { Builder, FlashMessagesManager, I18nManager, RoutesManager } from '../src'

test.group('Builder', (group) => {
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

    return () => {
      builder.prepareForNewRequest()
    }
  })

  test('stores globals', ({ assert }) => {
    const data = { lorem: 'ipsum', test: 123, hello: { to: 'world' } }

    builder.addGlobals(data)
    assert.deepEqual(builder.globals, data)

    builder.prepareForNewRequest()
    assert.deepEqual(builder.globals, {})
  })

  test('stores flash messages', ({ assert }) => {
    const data = {
      firstName: 'Error on field',
      welcome: 'Welcome to AdonisJS + Radonis!',
    }

    builder.setFlashMessages(data)
    assert.deepEqual(builder.flashMessages, data)
    assert.deepEqual(builder.flashMessagesRequiredForHydration, {})

    flashMessagesManager.requireFlashMessageForHydration('firstName')
    assert.deepEqual(builder.flashMessagesRequiredForHydration, {
      firstName: 'Error on field',
    })

    builder.prepareForNewRequest()
    assert.deepEqual(builder.flashMessages, data)
    assert.deepEqual(builder.flashMessagesRequiredForHydration, {})
  })

  test('stores translation messages', ({ assert }) => {
    const data = {
      'hello': 'Hello { name }',
      'shared.sidebar.signOut': 'Sign Out',
      'shared.sidebar.signIn': 'Sign In',
      'shared.sidebar.signUp': 'Sign Up',
      'shared.modal.close': 'Close modal',
    }

    builder.setMessages(data)
    assert.deepEqual(builder.messages, data)
    assert.deepEqual(builder.messagesRequiredForHydration, {})

    i18nManager.requireMessageForHydration('hello')
    i18nManager.requireMessageForHydration('shared.sidebar.signIn')
    assert.deepEqual(builder.messagesRequiredForHydration, {
      'hello': 'Hello { name }',
      'shared.sidebar.signIn': 'Sign In',
    })

    builder.prepareForNewRequest()
    assert.deepEqual(builder.messages, data)
    assert.deepEqual(builder.messagesRequiredForHydration, {})
  })

  test('stores routes', ({ assert }) => {
    const data = {
      'drive.local.serve': '/uploads/*',
      'home': '/',
      'dashboard': '/dashboard',
    }

    builder.setRoutes(data)
    assert.deepEqual(builder.routes, data)
    assert.deepEqual(builder.routesRequiredForHydration, {})

    routesManager.requireRouteForHydration('drive.local.serve')
    assert.deepEqual(builder.routesRequiredForHydration, {
      'drive.local.serve': '/uploads/*',
    })

    builder.prepareForNewRequest()
    assert.deepEqual(builder.routes, data)
    assert.deepEqual(builder.routesRequiredForHydration, {})
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

    const propsHashOne = builder.registerProps('MyComponentOne', data) as any
    const propsHashTwo = builder.registerProps('MyComponentTwo', data) as any
    const propsHashThree = builder.registerProps('MyComponentThree', {}) as any

    assert.isString(propsHashOne)
    assert.isString(propsHashTwo)
    assert.isNull(propsHashThree)

    assert.deepEqual(builder.props, { [propsHashOne]: data, [propsHashTwo]: data })
  })

  test('throws when props are not serializable', ({ assert }) => {
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
