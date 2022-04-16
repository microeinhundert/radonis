/*
 * @microeinhundert/radonis
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { useMemo } from 'react'

import { FlashMessages } from '../internal/FlashMessages'
import { useHydration } from './useHydration'
import { useManifest } from './useManifest'

export function useFlashMessages() {
  const { flashMessages } = useManifest()
  const hydration = useHydration()

  return useMemo(() => new FlashMessages(flashMessages, !!hydration.root), [flashMessages, hydration])
}
