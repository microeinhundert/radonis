import { HydrationRoot } from '@ioc:Adonis/Addons/Radonis'
import React from 'react'

import Demo from '../components/Demo'

function Welcome() {
  return (
    <HydrationRoot componentName="Demo">
      <Demo text="Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet." />
    </HydrationRoot>
  )
}

export { Welcome }
