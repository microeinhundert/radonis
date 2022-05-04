/*
 * @microeinhundert/radonis-unocss
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { UserConfig } from '@unocss/core'
import presetUno from '@unocss/preset-uno'

export const config: UserConfig = {
  presets: [presetUno()],
}
