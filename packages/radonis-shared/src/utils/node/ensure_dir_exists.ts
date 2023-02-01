/*
 * @microeinhundert/radonis-shared
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { existsSync } from 'node:fs'
import { mkdir } from 'node:fs/promises'
import { dirname } from 'node:path'

/**
 * Ensure a directory exists
 */
export async function ensureDirExists(path: string) {
  const dir = dirname(path)

  if (!existsSync(dir)) {
    await mkdir(dir, { recursive: true })
  }
}
