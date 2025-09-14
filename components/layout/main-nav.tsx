"use client"

import { UserProfile } from "./user-profile"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface MainNavProps {
  onSignOut?: () => void
}

export function MainNav({ onSignOut }: MainNavProps) {
  const pathname = usePathname()

  return (
    <nav className="border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-xl font-bold">
            Rifas-Rifas3
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className={`text-sm ${
                pathname === "/dashboard"
                  ? "text-foreground font-semibold"
                  : "text-muted-foreground"
              }`}
            >
              Dashboard
            </Link>
            <Link
              href="/rifas"
              className={`text-sm ${
                pathname.startsWith("/rifas")
                  ? "text-foreground font-semibold"
                  : "text-muted-foreground"
              }`}
            >
              Mis Rifas
            </Link>
          </div>
        </div>
        <UserProfile onSignOut={onSignOut} />
      </div>
    </nav>
  )
}