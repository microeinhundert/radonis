/*
 * @microeinhundert/radonis-unocss
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { UserConfig } from "@unocss/core";
import presetWind from "@unocss/preset-wind";

import { basePreflight, formsPreflight } from "./preflight";

/**
 * @internal
 */
export const config: UserConfig = {
  presets: [presetWind()],
  preflights: [basePreflight, formsPreflight],
};
