/*
 * @microeinhundert/radonis-server
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { test } from '@japa/runner'

import { HeadManager } from '../src/HeadManager'
import { headManagerConfigFixture } from './fixtures/headManagerConfig'

/**
 * Head Manager
 */
test.group('Head Manager', (group) => {
  let headManager: HeadManager

  group.each.setup(() => {
    headManager = new HeadManager(headManagerConfigFixture)
  })

  test('outputs title set via config', ({ assert }) => {
    assert.equal(headManager.getTitleTag(), '<title>Radonis</title>')
  })

  test('outputs title with prefix and suffix', ({ assert }) => {
    headManager = new HeadManager({
      head: {
        title: {
          default: 'Radonis',
          prefix: 'Prefix',
          suffix: 'Suffix',
          separator: '-',
        },
        defaultMeta: {
          charSet: 'utf-8',
          viewport: 'width=device-width, initial-scale=1.0',
        },
      },
    })

    assert.equal(headManager.getTitleTag(), '<title>Prefix - Radonis - Suffix</title>')
  })

  test('outputs meta set via config', ({ assert }) => {
    const expectedMetaTags = [
      '<meta charset="utf-8" />',
      '<meta content="width=device-width, initial-scale=1.0" name="viewport" />',
    ]

    assert.equal(headManager.getMetaTags(), expectedMetaTags.join('\n'))
  })

  test('allows setting title', ({ assert }) => {
    headManager.setTitle('A custom title')
    assert.equal(headManager.getTitleTag(), '<title>A custom title</title>')
  })

  test('allows adding tags', ({ assert }) => {
    headManager.addTags([
      {
        name: 'script',
        content: 'alert("Hello")',
        attributes: {
          defer: true,
        },
      },
    ])
    assert.equal(headManager.getTags(), '<script defer>alert("Hello")</script>')
  })

  test('allows adding meta', ({ assert }) => {
    const expectedMetaTags = [
      '<meta charset="utf-8" />',
      '<meta content="width=device-width, initial-scale=1.0" name="viewport" />',
      '<meta content="#ffffff" name="theme-color" />',
    ]

    headManager.addMeta({ 'theme-color': '#ffffff' })
    assert.equal(headManager.getMetaTags(), expectedMetaTags.join('\n'))
  })

  test('allows adding open graph meta', ({ assert }) => {
    const expectedMetaTags = [
      '<meta charset="utf-8" />',
      '<meta content="width=device-width, initial-scale=1.0" name="viewport" />',
      '<meta content="This is a description" property="og:description" />',
    ]

    headManager.addMeta({ 'og:description': 'This is a description' })
    assert.equal(headManager.getMetaTags(), expectedMetaTags.join('\n'))
  })

  test('allows adding meta with custom attributes', ({ assert }) => {
    const expectedMetaTags = [
      '<meta charset="utf-8" />',
      '<meta content="width=device-width, initial-scale=1.0" name="viewport" />',
      '<meta name="test" a-custom-property="Custom property content" />',
    ]

    headManager.addMeta({ test: [{ 'name': 'test', 'a-custom-property': 'Custom property content' }] })
    assert.equal(headManager.getMetaTags(), expectedMetaTags.join('\n'))
  })

  test('allows overriding meta', ({ assert }) => {
    headManager.addMeta({ 'viewport': 'width=device-width, initial-scale=2.0', 'theme-color': '#000000' })

    const expectedMetaTags = [
      '<meta charset="utf-8" />',
      '<meta content="width=device-width, initial-scale=2.0" name="viewport" />',
      '<meta content="#000000" name="theme-color" />',
    ]

    assert.equal(headManager.getMetaTags(), expectedMetaTags.join('\n'))
  })

  test('reverts back to default title on new request', ({ assert }) => {
    headManager.setTitle('A custom title')
    headManager.prepareForNewRequest()
    assert.equal(headManager.getTitleTag(), '<title>Radonis</title>')
  })

  test('reverts back to default tags on new request', ({ assert }) => {
    headManager.addTags([
      {
        name: 'script',
        content: 'alert("Hello")',
      },
    ])
    headManager.prepareForNewRequest()
    assert.equal(headManager.getTags(), '')
  })

  test('reverts back to default meta on new request', ({ assert }) => {
    const expectedMetaTags = [
      '<meta charset="utf-8" />',
      '<meta content="width=device-width, initial-scale=1.0" name="viewport" />',
    ]

    headManager.addMeta({ 'theme-color': '#000000' })
    headManager.prepareForNewRequest()
    assert.equal(headManager.getMetaTags(), expectedMetaTags.join('\n'))
  })
})
