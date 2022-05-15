/*
 * @microeinhundert/radonis-hooks
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { useManifest } from './useManifest'

export function useGlobals() {
  const { globals } = useManifest()

  return globals
}