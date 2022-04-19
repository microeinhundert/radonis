import { useI18n } from '@microeinhundert/radonis'
import React from 'react'

import Demo from '../components/Demo'

function Welcome() {
  const i18n = useI18n()

  return <Demo>{i18n.formatMessage('general.welcome')}</Demo>
}

export { Welcome }
