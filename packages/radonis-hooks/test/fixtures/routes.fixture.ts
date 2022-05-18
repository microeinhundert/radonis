/*
 * @microeinhundert/radonis-hooks
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

export const routesFixtureOne = {
  'home': '/',
  'withWildcard': '/foo/*',
  'withoutParams': '/foo',
  'singleParam': '/foo/:id',
  'singleParamInBetween': '/foo/:id/edit',
  'singleOptionalParam': '/foo/:id?',
  'singleOptionalParamInBetween': '/foo/:id?/edit',
  'multipleParams': '/foo/:name/bar/:id',
  'AuthController.signUp': '/signUp',
}
