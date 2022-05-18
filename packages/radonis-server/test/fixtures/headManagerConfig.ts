/*
 * @microeinhundert/radonis-server
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

export const headManagerConfigFixture = {
  head: {
    title: {
      default: 'Radonis',
      prefix: '',
      suffix: '',
      separator: '|',
    },
    defaultMeta: {
      charSet: 'utf-8',
      viewport: 'width=device-width, initial-scale=1.0',
    },
  },
} as const
