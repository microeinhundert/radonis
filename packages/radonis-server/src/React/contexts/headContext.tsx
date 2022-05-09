/*
 * @microeinhundert/radonis-server
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { Dispatch, ReactNode } from 'react'
import React, { createContext, useReducer } from 'react'

export enum HeadActionType {
  AddMeta = 'ADD_META',
}

type HeadAction = {
  type: HeadActionType.AddMeta
  payload: Radonis.HTMLMetaDescriptor
}

type HeadState = {
  data: {
    meta: Radonis.HTMLMetaDescriptor
  }
  dispatchData: Dispatch<HeadAction>
}

const initialState: HeadState = {
  data: {
    meta: {
      viewport: 'width=device-width, initial-scale=1.0',
    },
  },
  dispatchData: () => null,
}

export const headContext = createContext(initialState)

function headDataReducer(state: HeadState['data'], action: HeadAction): HeadState['data'] {
  switch (action.type) {
    case HeadActionType.AddMeta: {
      return {
        ...state,
        meta: {
          ...state.meta,
          ...action.payload,
        },
      }
    }
  }
}

export function HeadContextProvider({ children }: { children: ReactNode }) {
  const [data, dispatchData] = useReducer(headDataReducer, initialState.data)

  return <headContext.Provider value={{ data, dispatchData }}>{children}</headContext.Provider>
}

export const HeadContextConsumer = headContext.Consumer
