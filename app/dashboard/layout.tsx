"use client"

import { NavUserProfile } from "@/components/nav-user-profile"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-xl font-bold">
              Rifas-Rifas1
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
                href="/dashboard/mis-rifas"
                className={`text-sm ${
                  pathname.includes("/dashboard/mis-rifas")
                    ? "text-foreground font-semibold"
                    : "text-muted-foreground"
                }`}
              >
                Mis Rifas
              </Link>
            </div>
          </div>
          <NavUserProfile />
        </div>
      </nav>
      {children}
    </div>
  )
}