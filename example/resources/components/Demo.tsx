import { useI18n, useTwind } from '@microeinhundert/radonis'
import React from 'react'

function Demo() {
  const { tx } = useTwind()
  const i18n = useI18n()

  return <h1 className={tx`text-2xl`}>{i18n.formatMessage('general.welcome')}</h1>
}

export default Demo
