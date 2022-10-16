/*
 * @microeinhundert/radonis-server
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * Adapted from https://github.com/denoland/fresh
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { isProduction } from '@microeinhundert/radonis-shared'
import { createElement as h } from 'react'

import type { DefaultErrorPageProps } from '../types'

/**
 * The default error page
 * @internal
 */
export function DefaultErrorPage({ error }: DefaultErrorPageProps) {
  let message

  if (!isProduction) {
    if (error instanceof Error) {
      message = error.stack
    } else {
      message = String(error)
    }
  }

  return h(
    'div',
    {
      style: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      },
    },
    h(
      'div',
      {
        style: {
          border: '#f3f4f6 2px solid',
          borderTop: 'red 4px solid',
          background: '#f9fafb',
          margin: 16,
          minWidth: '300px',
          width: '50%',
        },
      },
      h(
        'p',
        {
          style: {
            margin: 0,
            fontSize: '12pt',
            padding: 16,
            fontFamily: 'sans-serif',
          },
        },
        'An error occured during route handling or page rendering.'
      ),
      message &&
        h(
          'pre',
          {
            style: {
              margin: 0,
              fontSize: '12pt',
              overflowY: 'auto',
              padding: 16,
              paddingTop: 0,
              fontFamily: 'monospace',
            },
          },
          message
        )
    )
  )
}

DefaultErrorPage.displayName = 'RadonisDefaultErrorPage'
