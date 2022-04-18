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

import { useApplication } from '../hooks/useApplication'
import { useManifestBuilder } from '../hooks/useManifestBuilder'
import { useRequest } from '../hooks/useRequest'

interface DocumentProps {
  children: ReactNode
}

export function Document({ children }: DocumentProps) {
  const { locale } = useManifestBuilder()
  const request = useRequest()
  const application = useApplication()

  return (
    <html className="h-full bg-gray-100" lang={locale}>
      <head>
        <meta charSet="utf-8" />
        <meta content="width=device-width, initial-scale=1.0" name="viewport" />
        <meta content={request.csrfToken} name="csrf-token" />
        <title>{application.appName}</title>
        <div id="rad-styles" />
      </head>
      <body className="h-full">
        {children}
        <div id="rad-scripts" />
      </body>
    </html>
  )
}
