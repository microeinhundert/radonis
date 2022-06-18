import { useI18n } from '@microeinhundert/radonis'
import React, { useState } from 'react'

interface DemoProps {
  name?: string
  text: string
}

function Demo({ name, text }: DemoProps) {
  const i18n = useI18n()
  const [clicked, setClicked] = useState(false)

  return (
    <div className="max-w-lg p-8">
      <h1 className="text-2xl font-bold mb-4">
        {name
          ? i18n.formatMessage('general.personalizedWelcome', { name })
          : i18n.formatMessage('general.welcome')}
      </h1>
      <p>{text}</p>
      <button type="button" onClick={() => setClicked(true)}>
        Test
      </button>
      {clicked && <p className="text-green-500">Clicked</p>}
    </div>
  )
}

export default Demo
