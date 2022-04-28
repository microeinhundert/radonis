import { useI18n } from '@microeinhundert/radonis'
import { useTwind } from '@microeinhundert/radonis-twind'
import React from 'react'

interface DemoTwoProps {
  text: string
}

export default function DemoTwo({ text }: DemoTwoProps) {
  const { tx } = useTwind()
  const i18n = useI18n()

  return (
    <div className={tx`max-w-lg p-8`}>
      <h1
        className={tx`
          text-2xl
          font-bold
          mb-4
        `}
      >
        {i18n.formatMessage('general.welcome')}
      </h1>
      <p>{text}</p>
    </div>
  )
}
