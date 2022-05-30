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
      <Form<{ test: string }, { error: string }>
        action="personalizedWelcome"
        hooks={{
          onMutate: () => {
            console.log('onMutate')
          },
          onError: (form) => {
            console.log(form)
          },
        }}
        method="post"
        params={{ name: 'test' }}
      >
        {({ status }) => {
          return (
            <>
              <input name="text" type="text" />
              <button name="test" type="submit" value="test">
                {status === 'loading' ? 'Loading...' : 'Submit'}
              </button>
            </>
          )
        }}
      </Form>
    </div>
  )
}

export default Demo
