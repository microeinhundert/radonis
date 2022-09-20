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
  generateComponentIdentifierUnionType,
  generateMessageIdentifierUnionType,
  generateRouteIdentifierUnionType,
} from '../src'

/**
 * Type Generators
 */
test.group('Type Generators', () => {
  test('generates component identifier union', ({ assert }) => {
    const declaration = generateComponentIdentifierUnionType(['ComponentOne', 'ComponentTwo', 'ComponentThree'])
    assert.equal(declaration, `type ComponentIdentifier = 'ComponentOne' | 'ComponentTwo' | 'ComponentThree'`)
  })

  test('generates empty component identifier union', ({ assert }) => {
    const emptyDeclaration = generateComponentIdentifierUnionType([])
    assert.equal(emptyDeclaration, `type ComponentIdentifier = never`)
  })

  test('generates message identifier union', ({ assert }) => {
    const declaration = generateMessageIdentifierUnionType(['message.one', 'message.two', 'welcome'])
    assert.equal(declaration, `type MessageIdentifier = 'message.one' | 'message.two' | 'welcome'`)
  })

  test('generates empty message identifier union', ({ assert }) => {
    const emptyDeclaration = generateMessageIdentifierUnionType([])
    assert.equal(emptyDeclaration, `type MessageIdentifier = never`)
  })

  test('generates route identifier union', ({ assert }) => {
    const declaration = generateRouteIdentifierUnionType(['drive.local.serve', 'home', 'dashboard'])
    assert.equal(declaration, `type RouteIdentifier = 'drive.local.serve' | 'home' | 'dashboard'`)
  })

  test('generates empty route identifier union', ({ assert }) => {
    const emptyDeclaration = generateRouteIdentifierUnionType([])
    assert.equal(emptyDeclaration, `type RouteIdentifier = never`)
  })
})
