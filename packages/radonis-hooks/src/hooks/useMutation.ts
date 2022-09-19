/* eslint-disable @typescript-eslint/no-shadow */

/*
 * @microeinhundert/radonis-hooks
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * Adapted from https://github.com/sergiodxa/use-mutation
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { Reducer } from 'react'
import { useCallback, useReducer, useRef } from 'react'

import type { MutationOptions, MutationResult, MutationStatus } from '../types'
import { useGetLatest } from './internal/useGetLatest'
import { useSafeCallback } from './internal/useSafeCallback'

/**
 * Hook for dispatching mutations
 * @see https://radonis.vercel.app/docs/hooks/use-mutation
 */
export function useMutation<TInput, TData, TError>(
  mutationFunction: (input: TInput) => Promise<TData>,
  {
    onMutate,
    onSuccess,
    onFailure,
    onSettled,
    throwOnFailure = false,
    useErrorBoundary = false,
  }: MutationOptions<TInput, TData, TError> = {}
): MutationResult<TInput, TData, TError> {
  type State = { status: MutationStatus; data?: TData; error?: TError }

  type Action =
    | { type: 'RESET' }
    | { type: 'MUTATE' }
    | { type: 'SUCCESS'; data: TData }
    | { type: 'FAILURE'; error: TError }

  const [{ status, data, error }, unsafeDispatch] = useReducer<Reducer<State, Action>>(
    function reducer(_, action) {
      switch (action.type) {
        case 'RESET':
          return { status: 'idle' }
        case 'MUTATE':
          return { status: 'running' }
        case 'SUCCESS':
          return { status: 'success', data: action.data }
        case 'FAILURE':
          return { status: 'failure', error: action.error }
        default:
          throw Error('Invalid action')
      }
    },
    { status: 'idle' }
  )

  const getMutationFunction = useGetLatest(mutationFunction)
  const latestMutation = useRef(0)
  const safeDispatch = useSafeCallback(unsafeDispatch)

  const mutate = useCallback(
    async (
      input: TInput,
      config: Omit<MutationOptions<TInput, TData, TError>, 'onMutate' | 'useErrorBoundary'> = {}
    ) => {
      const mutation = Date.now()
      latestMutation.current = mutation

      safeDispatch({ type: 'MUTATE' })

      const rollback = await onMutate?.({ input })

      try {
        const data = await getMutationFunction()(input)

        if (latestMutation.current === mutation) {
          safeDispatch({ type: 'SUCCESS', data })
        }

        await onSuccess?.({ data, input })
        await config.onSuccess?.({ data, input })

        await onSettled?.({ status: 'success', data, input })
        await config.onSettled?.({ status: 'success', data, input })

        return data
      } catch (error) {
        await onFailure?.({ error, rollback, input })
        await config.onFailure?.({ error, rollback, input })

        await onSettled?.({ status: 'failure', error, input, rollback })
        await config.onSettled?.({
          status: 'failure',
          error,
          input,
          rollback,
        })

        if (latestMutation.current === mutation) {
          safeDispatch({ type: 'FAILURE', error })
        }

        if (config.throwOnFailure ?? throwOnFailure) throw error

        return
      }
    },
    [getMutationFunction, onFailure, onMutate, onSettled, onSuccess, safeDispatch, throwOnFailure]
  )

  const reset = useCallback(() => safeDispatch({ type: 'RESET' }), [safeDispatch])

  if (useErrorBoundary && error) throw error

  return [mutate, { status, data, error, reset }]
}
