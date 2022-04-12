import type { FunctionComponent } from 'react';
import type { ReactNode } from 'react';
import React from 'react';

import { useAdonis } from '../../hooks/useAdonis';
import { useManifestBuilder } from '../hooks/useManifestBuilder';

interface DocumentProps {
  children: ReactNode;
  assets: {
    jsFiles: string[];
    cssFiles: string[];
  };
}

export const Document: FunctionComponent<DocumentProps> = ({ children, assets }) => {
  const { locale } = useManifestBuilder();
  const { app, request } = useAdonis();

  return (
    <html className="h-full bg-gray-100" lang={locale}>
      <head>
        <meta charSet="utf-8" />
        <meta content="width=device-width, initial-scale=1.0" name="viewport" />
        {request.csrfToken && <meta content={request.csrfToken} name="csrf-token" />}
        <title>{app.appName}</title>
        {assets.cssFiles.map((file) => (
          <link key={file} href={file} rel="stylesheet" />
        ))}
      </head>
      <body className="h-full">
        {children}
        <div id="rad-manifest" />
        {assets.jsFiles.map((file) => (
          <script key={file} src={file} defer />
        ))}
      </body>
    </html>
  );
};
