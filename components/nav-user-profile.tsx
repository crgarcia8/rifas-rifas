"use client"

import { useEffect, useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Button } from "./ui/button"
import { User } from "@supabase/supabase-js"
import Image from "next/image"

export function NavUserProfile() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClientComponentClient()

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      debugger
      setUser(user)
      setLoading(false)
    }

    fetchUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase.auth])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
  }

  if (loading) {
    return <div className="h-8 w-8 animate-pulse rounded-full bg-muted" />
  }

  if (!user) {
    return null
  }

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <div className="text-sm">
          <p className="font-medium">{user.user_metadata.full_name}</p>
          <p className="text-muted-foreground">{user.email}</p>
        </div>
        {user.user_metadata.avatar_url && (
          <Image
            src={user.user_metadata.avatar_url}
            alt={user.user_metadata.full_name}
            width={32}
            height={32}
            className="rounded-full"
          />
        )}
      </div>
      <Button variant="outline" size="sm" onClick={handleSignOut}>
        Cerrar sesión
      </Button>
    </div>
  )
}