"use client"

import { NavUserProfile } from "./nav-user-profile"

interface MainLayoutProps {
  children: React.ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
    debugger
  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="text-xl font-bold">Rifas-Rifas</h1>
          <NavUserProfile />
        </div>
      </nav>
      {children}
    </div>
  )
}