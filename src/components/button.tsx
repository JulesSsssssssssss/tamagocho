'use client'

import { Button as ShadcnButton } from '@/components/ui/button'
import { type ComponentProps } from 'react'

export default function Button (props: ComponentProps<typeof ShadcnButton>): React.ReactNode {
  return <ShadcnButton {...props} />
}
