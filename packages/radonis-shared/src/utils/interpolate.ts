/*
 * @microeinhundert/radonis-shared
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/**
 * Uncurry a function
 */
function uncurry(fn: any) {
  return function (...args: any[]) {
    return Function.call.apply(fn, args)
  }
}

/**
 * Parse a prop
 */
function parseProp(data: any, key: string) {
  const tokens = key.split('.')
  while (tokens.length) {
    if (data === null || typeof data !== 'object') {
      return
    }
    const token = tokens.shift()!
    data = uncurry(Object.prototype.hasOwnProperty)(data, token) ? data[token] : undefined
  }
  return data
}

/**
 * Interpolate values inside curly braces
 * @internal
 */
export function interpolate(input: string, data: any) {
  return input.replace(/(\\)?{{(.*?)}}/g, (_, escapeChar, key) => {
    if (escapeChar) {
      return `{{${key}}}`
    }

    return parseProp(data, key.trim())
  })
}
