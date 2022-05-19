/*
 * @microeinhundert/radonis-hooks
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { test } from '@japa/runner'

import { FlashMessagesImpl } from '../src/internal/FlashMessages'
import { flashMessagesFixtureOne } from './fixtures/flashMessages.fixture'

/**
 * Flash Messages
 */
test.group('Flash Messages', (group) => {
  let flashMessages: FlashMessagesImpl

  group.each.setup(() => {
    flashMessages = new FlashMessagesImpl(flashMessagesFixtureOne)
  })

  test('gets all flash messages', ({ assert }) => {
    assert.deepEqual(flashMessages.all(), {
      'someMessage': 'This is a flash message.',
      'someOtherMessage.0': 'This is a flash message.',
      'errors.required': 'This field is required.',
    })
  })

  test('gets all error flash messages', ({ assert }) => {
    assert.deepEqual(flashMessages.allErrors(), {
      'errors.required': 'This field is required.',
    })
  })

  test('gets flash messages', ({ assert }) => {
    assert.equal(flashMessages.get('someMessage'), 'This is a flash message.')
    assert.equal(flashMessages.get('someOtherMessage.0'), 'This is a flash message.')
    assert.equal(flashMessages.get('someOtherMessage'), 'This is a flash message.')
    assert.equal(flashMessages.get('errors.required'), 'This field is required.')
  })

  test('gets error flash messages', ({ assert }) => {
    assert.equal(flashMessages.getError('required'), 'This field is required.')
  })

  test('returns undefined if flash message does not exist', ({ assert }) => {
    assert.isUndefined(flashMessages.get('doesNotExist.0'))
    assert.isUndefined(flashMessages.get('doesNotExist'))
  })

  test('returns undefined if error flash message does not exist', ({ assert }) => {
    assert.isUndefined(flashMessages.getError('doesNotExist.0'))
    assert.isUndefined(flashMessages.getError('doesNotExist'))
  })

  test('checks if flash messages exist', ({ assert }) => {
    assert.isTrue(flashMessages.has())
  })

  test('checks if error flash messages exist', ({ assert }) => {
    assert.isTrue(flashMessages.hasError())
  })

  test('checks if specific flash messages exist', ({ assert }) => {
    assert.isTrue(flashMessages.has('someMessage'))
    assert.isTrue(flashMessages.has('someOtherMessage.0'))
    assert.isTrue(flashMessages.has('someOtherMessage'))
    assert.isFalse(flashMessages.has('doesNotExist.0'))
    assert.isFalse(flashMessages.has('doesNotExist'))
  })

  test('checks if specific error flash messages exist', ({ assert }) => {
    assert.isTrue(flashMessages.hasError('required'))
  })
})
