/*
 * @microeinhundert/radonis-types
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { test } from '@japa/runner'

import {
  generateAvailableComponentsInterface,
  generateAvailableMessagesInterface,
  generateAvailableRoutesInterface,
} from '../src'

/**
 * Type Generators
 */
test.group('Type Generators', () => {
  test('generates `AvailableComponents` interface', ({ assert }) => {
    const declaration = generateAvailableComponentsInterface(['ComponentOne', 'ComponentTwo', 'ComponentThree'])
    assert.equal(
      declaration,
      `interface AvailableComponents { value: 'ComponentOne' | 'ComponentTwo' | 'ComponentThree' }`
    )
  })

  test('generates empty `AvailableComponents` interface', ({ assert }) => {
    const emptyDeclaration = generateAvailableComponentsInterface([])
    assert.equal(emptyDeclaration, `interface AvailableComponents { value: never }`)
  })

  test('generates `AvailableMessages` interface', ({ assert }) => {
    const declaration = generateAvailableMessagesInterface(['message.one', 'message.two', 'welcome'])
    assert.equal(declaration, `interface AvailableMessages { value: 'message.one' | 'message.two' | 'welcome' }`)
  })

  test('generates empty `AvailableMessages` interface', ({ assert }) => {
    const emptyDeclaration = generateAvailableMessagesInterface([])
    assert.equal(emptyDeclaration, `interface AvailableMessages { value: never }`)
  })

  test('generates `AvailableRoutes` interface', ({ assert }) => {
    const declaration = generateAvailableRoutesInterface(['drive.local.serve', 'home', 'dashboard'])
    assert.equal(declaration, `interface AvailableRoutes { value: 'drive.local.serve' | 'home' | 'dashboard' }`)
  })

  test('generates empty `AvailableRoutes` interface', ({ assert }) => {
    const emptyDeclaration = generateAvailableRoutesInterface([])
    assert.equal(emptyDeclaration, `interface AvailableRoutes { value: never }`)
  })
})
