import type { ReactNode } from 'react'
import React from 'react'

interface DemoProps {
  children?: ReactNode
}

function Demo({ children }: DemoProps) {
  return <h1>{children}</h1>
}

export default Demo
