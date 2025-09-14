"use client"

import { NavUserProfile } from "./nav-user-profile"
import { useRouter } from "next/navigation"

interface MainLayoutProps {
  children: React.ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  const router = useRouter()

  const handleRestartToInitialState = () => {
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="text-xl font-bold">Rifas-Rifas2</h1>
          <NavUserProfile onSignOut={handleRestartToInitialState} />
        </div>
      </nav>
      {children}
    </div>
  )
}