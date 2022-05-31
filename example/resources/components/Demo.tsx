import { Form, useI18n } from '@microeinhundert/radonis'
import React from 'react'

interface DemoProps {
  name?: string
  text: string
}

function Demo({ name, text }: DemoProps) {
  const i18n = useI18n()

  return (
    <div className="max-w-lg p-8">
      <h1 className="text-2xl font-bold mb-4">
        {name
          ? i18n.formatMessage('general.personalizedWelcome', { name })
          : i18n.formatMessage('general.welcome')}
      </h1>
      <p>{text}</p>
    </div>
  )
}

export default Demo
