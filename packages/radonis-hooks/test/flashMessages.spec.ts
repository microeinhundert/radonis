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
    const all = flashMessages.all()
    assert.deepEqual(all, {
      'someMessage': 'This is a flash message.',
      'someOtherMessage.0': 'This is a flash message.',
      'errors.required': 'This field is required.',
    })
  })

  test('gets all validation error flash messages', ({ assert }) => {
    const all = flashMessages.allValidationErrors()
    assert.deepEqual(all, {
      'errors.required': 'This field is required.',
    })
  })

  test('gets flash messages', ({ assert }) => {
    const flashMessageOne = flashMessages.get('someMessage')
    assert.equal(flashMessageOne, 'This is a flash message.')

    const flashMessageTwo = flashMessages.get('someOtherMessage')
    assert.equal(flashMessageTwo, 'This is a flash message.')

    const flashMessageThree = flashMessages.get('someOtherMessage.0')
    assert.equal(flashMessageThree, 'This is a flash message.')

    const flashMessageFour = flashMessages.get('errors.required')
    assert.equal(flashMessageFour, 'This field is required.')
  })

  test('gets validation error flash messages', ({ assert }) => {
    const flashMessageOne = flashMessages.getValidationError('required')
    assert.equal(flashMessageOne, 'This field is required.')
  })

  test('returns undefined if flash message does not exist', ({ assert }) => {
    const flashMessageOne = flashMessages.get('doesNotExist')
    assert.isUndefined(flashMessageOne)

    const flashMessageTwo = flashMessages.get('doesNotExist.0')
    assert.isUndefined(flashMessageTwo)
  })

  test('returns undefined if validation error flash message does not exist', ({ assert }) => {
    const flashMessageOne = flashMessages.getValidationError('doesNotExist')
    assert.isUndefined(flashMessageOne)

    const flashMessageTwo = flashMessages.getValidationError('doesNotExist.0')
    assert.isUndefined(flashMessageTwo)
  })

  test('checks if flash messages exist', ({ assert }) => {
    const messagesExist = flashMessages.has()
    assert.isTrue(messagesExist)
  })

  test('checks if validation error flash messages exist', ({ assert }) => {
    const messagesExist = flashMessages.hasValidationError()
    assert.isTrue(messagesExist)
  })

  test('checks if specific flash messages exist', ({ assert }) => {
    const messageExistsOne = flashMessages.has('someMessage')
    assert.isTrue(messageExistsOne)

    const messageExistsTwo = flashMessages.has('someOtherMessage')
    assert.isTrue(messageExistsTwo)

    const messageExistsThree = flashMessages.has('someOtherMessage.0')
    assert.isTrue(messageExistsThree)

    const messageExistsFour = flashMessages.has('doesNotExist')
    assert.isFalse(messageExistsFour)

    const messageExistsFive = flashMessages.has('doesNotExist.0')
    assert.isFalse(messageExistsFive)
  })

  test('checks if specific validation error flash messages exist', ({ assert }) => {
    const messageExistsOne = flashMessages.hasValidationError('required')
    assert.isTrue(messageExistsOne)
  })
})
