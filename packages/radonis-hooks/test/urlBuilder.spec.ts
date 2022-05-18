/*
 * @microeinhundert/radonis-hooks
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { test } from '@japa/runner'

import { UrlBuilderImpl } from '../src/internal/UrlBuilder'
import { routesFixtureOne } from './fixtures/routes.fixture'

/**
 * Url Builder
 */
test.group('Url Builder', (group) => {
  let urlBuilder: UrlBuilderImpl

  group.each.setup(() => {
    urlBuilder = new UrlBuilderImpl(routesFixtureOne)
  })

  test('builds url', ({ assert }) => {
    const urlOne = urlBuilder.make('home')
    assert.equal(urlOne, '/')

    const urlTwo = urlBuilder.make('withoutParams')
    assert.equal(urlTwo, '/foo')

    const urlThree = urlBuilder.make('AuthController.signUp')
    assert.equal(urlThree, '/signUp')
  })

  test('builds url with params', ({ assert }) => {
    const urlOne = urlBuilder.withParams({ id: 123 }).make('singleParam')
    assert.equal(urlOne, '/foo/123')

    const urlTwo = urlBuilder.withParams({ id: 123 }).make('singleParamInBetween')
    assert.equal(urlTwo, '/foo/123/edit')

    const urlThree = urlBuilder.withParams({ name: 'microeinhundert', id: 100 }).make('multipleParams')
    assert.equal(urlThree, '/foo/microeinhundert/bar/100')
  })

  test('builds url with optional params', ({ assert }) => {
    const urlOne = urlBuilder.make('singleOptionalParam')
    assert.equal(urlOne, '/foo')

    const urlTwo = urlBuilder.make('singleOptionalParamInBetween')
    assert.equal(urlTwo, '/foo/edit')
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
    const urlOne = urlBuilder.withQueryParams({ paramOne: 'test', paramTwo: 123 }).make('home')
    assert.equal(urlOne, '/?paramOne=test&paramTwo=123')

    const urlTwo = urlBuilder.withParams({ id: 123 }).withQueryParams({ paramOne: 'test' }).make('singleParamInBetween')
    assert.equal(urlTwo, '/foo/123/edit?paramOne=test')
  })

  test('clears params for next url', ({ assert }) => {
    const urlOne = urlBuilder.withParams({ id: 123 }).withQueryParams({ paramOne: 'test' }).make('singleParamInBetween')
    assert.equal(urlOne, '/foo/123/edit?paramOne=test')

    const urlTwo = urlBuilder.withParams({ id: 123 }).make('singleParamInBetween')
    assert.equal(urlTwo, '/foo/123/edit')

    assert.throws(
      () => urlBuilder.make('singleParamInBetween'),
      'The "id" param is required to make the URL for the "/foo/:id/edit" route'
    )
  })
})
