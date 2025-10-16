'use client'

import { Suspense } from 'react'
import { useAuthCheck } from '@/hooks/use-auth-check'

interface AuthSuspenseWrapperProps {
  children: ({ successMessage, setSuccessMessage }: { successMessage: string; setSuccessMessage: (msg: string) => void }) => React.ReactNode
}

function AuthContent({ children }: AuthSuspenseWrapperProps) {
  const { successMessage, setSuccessMessage } = useAuthCheck()
  return <>{children({ successMessage, setSuccessMessage })}</>
}

export default function AuthSuspenseWrapper(props: AuthSuspenseWrapperProps) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthContent {...props} />
    </Suspense>
  )
}