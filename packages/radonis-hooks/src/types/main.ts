/*
 * @microeinhundert/radonis-hooks
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { MaybePromise } from '@microeinhundert/radonis-types'

export type MutationResetFunction = () => void

export type MutationRollbackFunction = () => void

export type MutationStatus = 'idle' | 'loading' | 'success' | 'failure'

export type MutationResult<TInput, TData, TError> = [
  (input: TInput) => Promise<TData | undefined>,
  { status: MutationStatus; data?: TData; error?: TError; reset: MutationResetFunction }
]

export interface MutationHooks<TInput, TData, TError> {
  /**
   * A function to be executed before the mutation runs.
   *
   * It receives the same input as the mutate function.
   *
   * It can be an async or sync function, in both cases if it returns a function,
   * it will be kept as a way to rollback the changes applied inside onMutate.
   */
  onMutate?(params: { input: TInput }): MaybePromise<MutationRollbackFunction | void>

  /**
   * A function to be executed after the mutation resolves successfully.
   *
   * It receives the result of the mutation.
   *
   * If a Promise is returned, it will be awaited before proceeding.
   */
  onSuccess?(params: { data: TData; input: TInput }): MaybePromise<void>

  /**
   * A function to be executed after the mutation failed to execute.
   *
   * If a Promise is returned, it will be awaited before proceeding.
   */
  onFailure?(params: { error: TError; rollback: MutationRollbackFunction | void; input: TInput }): MaybePromise<void>

  /**
   * A function to be executed after the mutation has resolved, either
   * successfully or as failure.
   *
   * This function receives the error or the result of the mutation.
   *
   * If a Promise is returned, it will be awaited before proceeding.
   */
  onSettled?(
    params:
      | { status: 'success'; data: TData; input: TInput }
      | {
          status: 'failure'
          error: TError
          rollback: MutationRollbackFunction | void
          input: TInput
        }
  ): MaybePromise<void>
}

export interface MutationOptions<TInput, TData, TError> extends MutationHooks<TInput, TData, TError> {
  /**
   * If `true`, a failure in the mutation will cause the `mutate`
   * function to throw.
   */
  throwOnFailure?: boolean

  /**
   * If `true`, a failure in the mutation will cause the hook to
   * throw at render time, making error boundaries catch the error.
   */
  useErrorBoundary?: boolean
}
