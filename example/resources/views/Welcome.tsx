import { HydrationRoot, useHead } from '@ioc:Adonis/Addons/Radonis'
import React from 'react'

import Demo from '../components/Demo'

interface WelcomeProps {
  name?: string
}

function Welcome({ name }: WelcomeProps) {
  const head = useHead()

  head.addMeta({
    title: 'Welcome',
  })

  return (
    <HydrationRoot componentName="Demo">
      <Demo
        name={name}
        text="Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet."
      />
    </HydrationRoot>
  )
}

export { Welcome }
