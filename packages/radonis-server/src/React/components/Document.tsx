/*
 * @microeinhundert/radonis-server
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { ReactNode } from 'react'
import React from 'react'

import { useManifestBuilder } from '../hooks/useManifestBuilder'

interface DocumentProps {
  children: ReactNode
}

export function Document({ children }: DocumentProps) {
  const manifestBuilder = useManifestBuilder()

  return (
    <html className="h-full bg-gray-100" lang={manifestBuilder.locale}>
      <head>
        {/* The tag below will be replaced after rendering */}
        <div id="rad-head" />
      </head>
      <body className="h-full">
        {children}
        {/* The tag below will be replaced after rendering */}
        <div id="rad-scripts" />
      </body>
    </html>
  )
}
