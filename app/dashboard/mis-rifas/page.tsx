"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function MisRifasPage() {
  const router = useRouter()
  const supabase = createClientComponentClient()

  // TODO: Implementar la carga de rifas desde la base de datos

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Mis Rifas</h1>
        <Button onClick={() => router.push("/")}>
          Crear Nueva Rifa
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* TODO: Implementar el listado de rifas */}
        <Card className="p-6">
          <p className="text-muted-foreground">
            No tienes rifas creadas aún.
          </p>
        </Card>
      </div>
    </div>
  )
}