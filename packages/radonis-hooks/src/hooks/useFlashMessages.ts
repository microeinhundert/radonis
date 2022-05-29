/*
 * @microeinhundert/radonis-hooks
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { useHydration } from '@microeinhundert/radonis-hydrate'
import { useMemo } from 'react'

import { FlashMessagesImpl } from '../implementations/FlashMessages'
import { useManifest } from './useManifest'

export function useFlashMessages() {
  const { flashMessages } = useManifest()
  const hydration = useHydration()

  return useMemo(() => new FlashMessagesImpl(flashMessages, !!hydration.root), [flashMessages, hydration])
}
