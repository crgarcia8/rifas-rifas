"use client"

import { GoogleSignInButton } from '@/components/ui/google-signin-button'
import { signInWithGoogle } from '@/lib/auth'

export default function LoginPage() {
  const handleGoogleSignIn = async () => {
    await signInWithGoogle()
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md space-y-4">
        <h1 className="text-2xl font-bold text-center">Iniciar sesión</h1>
        <GoogleSignInButton onClick={handleGoogleSignIn} />
      </div>
    </div>
  )
}