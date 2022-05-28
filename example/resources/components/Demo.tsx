import { Form, useI18n, useUrlBuilder } from '@microeinhundert/radonis'
import React from 'react'

interface DemoProps {
  name?: string
  text: string
}

function Demo({ name, text }: DemoProps) {
  const i18n = useI18n()
  const urlBuilder = useUrlBuilder()

  return (
    <>
      <Form
        action={urlBuilder.withParams({ name: 'hello' }).make('personalizedWelcome')}
        method="post"
      >
        {({ error }) => (
          <div>
            <input name="field" type="text" />
            <button type="submit">Submit</button>
            {error && <div>{error}</div>}
          </div>
        )}
      </Form>
      <div className="max-w-lg p-8">
        <h1 className="text-2xl font-bold mb-4">
          {name
            ? i18n.formatMessage('general.personalizedWelcome', { name })
            : i18n.formatMessage('general.welcome')}
        </h1>
        <p>{text}</p>
      </div>
    </>
  )
}

export default Demo
