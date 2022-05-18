/*
 * @microeinhundert/radonis-hooks
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { test } from '@japa/runner'

import { I18nImpl } from '../src/internal/I18n'
import { messagesFixtureOne } from './fixtures/messages.fixture'

/**
 * I18n
 */
test.group('I18n', (group) => {
  let i18n: I18nImpl

  group.each.setup(() => {
    i18n = new I18nImpl('de', messagesFixtureOne)
  })

  test('gets messages', ({ assert }) => {
    const message = i18n.formatMessage('message')
    assert.equal(message, 'Hello world')
  })

  test('inserts data into messages', ({ assert }) => {
    const message = i18n.formatMessage('messageWithVariable', { name: 'world' })
    assert.equal(message, 'Hello world')
  })

  test('throws if data is missing', ({ assert }) => {
    assert.throws(
      () => i18n.formatMessage('messageWithVariable'),
      'The intl string context variable "name" was not provided to the string "Hello { name }"'
    )
  })

  test('throws if message was not found', ({ assert }) => {
    assert.throws(() => i18n.formatMessage('doesNotExist'), 'Cannot find message for "doesNotExist"')
  })
})
