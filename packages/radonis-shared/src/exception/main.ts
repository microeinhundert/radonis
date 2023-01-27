/*
 * @microeinhundert/radonis-shared
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * Adapted from https://github.com/poppinss/utils
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/**
 * Extended Error object with the option to set error `status` and `code`
 */
export class RadonisException extends Error {
  declare static help?: string
  declare static code?: string
  declare static status?: number
  declare static message?: string

  /**
   * Name of the class that raised the exception
   */
  name: string

  /**
   * Optional help description for the error
   */
  declare help?: string

  /**
   * A machine readable error code
   */
  declare code?: string

  /**
   * A status code for the error
   */
  status: number

  constructor(message?: string, options?: ErrorOptions & { code?: string; status?: number }) {
    super(message, options)

    const ErrorConstructor = this.constructor as typeof RadonisException

    this.name = ErrorConstructor.name
    this.message = message || ErrorConstructor.message || ''
    this.status = options?.status || ErrorConstructor.status || 500

    const code = options?.code || ErrorConstructor.code
    if (code !== undefined) {
      this.code = code
    }

    const help = ErrorConstructor.help
    if (help !== undefined) {
      this.help = help
    }

    Error.captureStackTrace(this, ErrorConstructor)
  }

  get [Symbol.toStringTag]() {
    return this.constructor.name
  }

  toString() {
    if (this.code) {
      return `${this.name} [${this.code}]: ${this.message}`
    }
    return `${this.name}: ${this.message}`
  }
}

/**
 * Helper to format strings
 */
function format<T extends string>(string: string, ...args: T[]) {
  return args.reduce((p, c) => p.replace(/%s/, c), string)
}

/**
 * Helper to create anonymous error classes
 */
export function createError<T extends any[] = never>(
  message: string,
  code: string,
  status?: number
): typeof RadonisException & T extends never
  ? { new (args?: any, options?: ErrorOptions): RadonisException }
  : { new (args: T, options?: ErrorOptions): RadonisException } {
  return class extends RadonisException {
    static message = message
    static code = code
    static status = status

    constructor(args: T, options?: ErrorOptions) {
      super(format(message, ...(args || [])), options)
    }
  }
}
