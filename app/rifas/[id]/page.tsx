"use client"

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { Raffle } from "@/app/page"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function PublicRafflePage() {
  const params = useParams()
  const [raffle, setRaffle] = useState<Raffle | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClientComponentClient()

  useEffect(() => {
    const fetchRaffle = async () => {
      // TODO: Implementar la carga de la rifa desde Supabase
      setLoading(false)
    }

    fetchRaffle()
  }, [params.id, supabase])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-8">
            <div className="h-8 w-48 animate-pulse rounded-md bg-muted" />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!raffle) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-semibold mb-2">Rifa no encontrada</h2>
            <p className="text-muted-foreground">
              La rifa que buscas no existe o no está disponible.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>{raffle.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-6">{raffle.description}</p>

          <div className="grid grid-cols-10 gap-2">
            {raffle.numbers.map((number, index) => (
              <Button
                key={index}
                variant={number.isTaken ? "secondary" : "outline"}
                className="h-12 w-12"
                disabled={number.isTaken}
              >
                {index + 1}
              </Button>
            ))}
          </div>

          {/* Leyenda */}
          <div className="mt-6 flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded border" />
              <span className="text-sm">Disponible</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded bg-secondary" />
              <span className="text-sm">Ocupado</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}