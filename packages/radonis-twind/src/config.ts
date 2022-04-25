/*
 * @microeinhundert/radonis-twind
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import presetAutoprefix from '@twind/preset-autoprefix'
import presetTailwind from '@twind/preset-tailwind'
import presetTailwindForms from '@twind/preset-tailwind-forms'
import presetTypography from '@twind/preset-typography'
import { defineConfig } from 'twind'

export const config = defineConfig({
  presets: [presetTailwind(), presetTailwindForms(), presetTypography(), presetAutoprefix()],
})
