/*
 * @microeinhundert/radonis-hooks
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { test } from '@japa/runner'

import { UrlBuilderImpl } from '../src/implementations/UrlBuilder'
import { routesFixtureOne } from './fixtures/routes.fixture'

/**
 * Url Builder
 */
test.group('Url Builder', (group) => {
  let urlBuilder: UrlBuilderImpl

  group.each.setup(() => {
    urlBuilder = new UrlBuilderImpl(routesFixtureOne)
  })

  test('builds urls', ({ assert }) => {
    assert.equal(urlBuilder.make('home'), '/')
    assert.equal(urlBuilder.make('withoutParams'), '/foo')
  })

  test('builds urls with params', ({ assert }) => {
    assert.equal(urlBuilder.withParams({ id: 123 }).make('singleParam'), '/foo/123')
    assert.equal(urlBuilder.withParams({ id: 321 }).make('singleParamInBetween'), '/foo/321/edit')
    assert.equal(
      urlBuilder.withParams({ name: 'microeinhundert', id: 100 }).make('multipleParams'),
      '/foo/microeinhundert/bar/100'
    )
  })

  test('builds urls with optional params', ({ assert }) => {
    assert.equal(urlBuilder.make('singleOptionalParam'), '/foo')
    assert.equal(urlBuilder.make('singleOptionalParamInBetween'), '/foo/edit')
  })

  test('throws if route was not found', ({ assert }) => {
    assert.throws(() => urlBuilder.make('doesNotExist'), 'Cannot find route for "doesNotExist"')
  })

  test('throws if required params are missing', ({ assert }) => {
    assert.throws(
      () => urlBuilder.make('singleParam'),
      'The "id" param is required to make the URL for the "/foo/:id" route'
    )
    assert.throws(
      () => urlBuilder.make('multipleParams'),
      'The "name" param is required to make the URL for the "/foo/:name/bar/:id" route'
    )
    assert.throws(
      () => urlBuilder.withParams({ name: 'microeinhundert' }).make('multipleParams'),
      'The "id" param is required to make the URL for the "/foo/:name/bar/:id" route'
    )
  })

  test('throws if route contains wildcard token', ({ assert }) => {
    assert.throws(() => urlBuilder.make('withWildcard'), 'Wildcard routes are not supported')
  })

  test('appends query params to url', ({ assert }) => {
    assert.equal(
      urlBuilder.withQueryParams({ paramOne: 'test', paramTwo: 123 }).make('home'),
      '/?paramOne=test&paramTwo=123'
    )
    assert.equal(
      urlBuilder.withParams({ id: 123 }).withQueryParams({ paramOne: 'test' }).make('singleParamInBetween'),
      '/foo/123/edit?paramOne=test'
    )
  })

  test('clears params for next url', ({ assert }) => {
    assert.equal(
      urlBuilder.withParams({ id: 123 }).withQueryParams({ paramOne: 'test' }).make('singleParamInBetween'),
      '/foo/123/edit?paramOne=test'
    )
    assert.equal(urlBuilder.withParams({ id: 123 }).make('singleParamInBetween'), '/foo/123/edit')
    assert.throws(
      () => urlBuilder.make('singleParamInBetween'),
      'The "id" param is required to make the URL for the "/foo/:id/edit" route'
    )
  })
})
