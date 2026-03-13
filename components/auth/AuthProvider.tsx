'use client'

import { SessionProvider, useSession } from 'next-auth/react'
import { ReactNode } from 'react'

export function AuthProvider({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  )
}
