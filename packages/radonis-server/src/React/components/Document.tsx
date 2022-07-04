/*
 * @microeinhundert/radonis-server
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import React from 'react'

import type { DocumentProps } from '../../types'
import { useManifestBuilder } from '../hooks/internal/useManifestBuilder'

export function Document({ children }: DocumentProps) {
  const manifestBuilder = useManifestBuilder()

  return (
    <html className="h-ful" lang={manifestBuilder.locale}>
      <head></head>
      <body className="h-full">{children}</body>
    </html>
  )
}
