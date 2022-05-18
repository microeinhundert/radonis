/*
 * @microeinhundert/radonis-manifest
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

export const routesFixtureOne = {
  'drive.local.serve': '/uploads/*',
  'home': '/',
  'foo.index': '/foo',
  'foo.create': '/foo/create',
  'foo.show': '/foo/:id',
  'foo.edit': '/foo/:id/edit',
  'AuthController.signUp': '/signUp',
  'AuthController.signIn': '/signIn',
}
