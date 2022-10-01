/*
 * @microeinhundert/radonis-server
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { createElement as h } from 'react'

import { useManifestManager } from '../hooks/internal/useManifestManager'
import type { DocumentProps } from '../types'

/**
 * The component containing the HTML document markup
 * @internal
 */
export function Document({ children }: DocumentProps) {
  const manifestManager = useManifestManager()

  return h(
    'html',
    { className: 'h-full', lang: manifestManager.locale },
    h('head'),
    h('body', { className: 'h-full' }, children)
  )
}

Document.displayName = 'RadonisDocument'
