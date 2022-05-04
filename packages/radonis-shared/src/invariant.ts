import { isProduction, isServer } from './environment'

const fallbackMessage = 'Something went wrong'

/**
 * Throws a message when the passed condition is falsy
 */
export function invariant(condition: unknown, message?: string): asserts condition {
  if (condition) {
    return
  }

  if (isProduction && !isServer) {
    throw new Error(fallbackMessage)
  }

  throw new Error(`[Radonis Error] ${message ?? fallbackMessage}`)
}
