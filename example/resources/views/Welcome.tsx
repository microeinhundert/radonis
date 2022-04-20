import { HydrationRoot } from '@ioc:Adonis/Addons/Radonis'
import React from 'react'

import Demo from '../components/Demo'

function Welcome() {
  return (
    <HydrationRoot componentName="Demo">
      <Demo />
    </HydrationRoot>
  )
}

export { Welcome }
