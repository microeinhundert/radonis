import type { ReactNode } from 'react'
import React from 'react'

import { useApplication } from '../hooks/useApplication'
import { useManifestBuilder } from '../hooks/useManifestBuilder'
import { useRequest } from '../hooks/useRequest'

interface DocumentProps {
  children: ReactNode
  assets: {
    scripts: string[]
    stylesheets: string[]
  }
}

export function Document({ children, assets }: DocumentProps) {
  const { locale } = useManifestBuilder()
  const request = useRequest()
  const application = useApplication()

  return (
    <html className="h-full bg-gray-100" lang={locale}>
      <head>
        <meta charSet="utf-8" />
        <meta content="width=device-width, initial-scale=1.0" name="viewport" />
        {request.csrfToken && <meta content={request.csrfToken} name="csrf-token" />}
        <title>{application.appName}</title>
        {assets.stylesheets.map((file) => (
          <link key={file} href={file} rel="stylesheet" />
        ))}
      </head>
      <body className="h-full">
        {children}
        <div id="rad-manifest" />
        {assets.scripts.map((file) => (
          <script key={file} src={file} defer />
        ))}
      </body>
    </html>
  )
}
