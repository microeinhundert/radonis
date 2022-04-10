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
    <html lang={locale} className="h-full bg-gray-100">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        {request.csrfToken && <meta name="csrf-token" content={request.csrfToken} />}
        <title>{app.appName}</title>
        {assets.cssFiles.map((file) => (
          <link key={file} rel="stylesheet" href={file} />
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
