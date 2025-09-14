"use client"

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Raffle } from "@/app/page"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function ManageRafflePage() {
  const params = useParams()
  const router = useRouter()
  const [raffle, setRaffle] = useState<Raffle | null>(null)
  const [participantName, setParticipantName] = useState("")
  const [loading, setLoading] = useState(true)
  const supabase = createClientComponentClient()

  useEffect(() => {
    const fetchRaffle = async () => {
      // TODO: Implementar la carga de la rifa desde Supabase
      setLoading(false)
    }

    fetchRaffle()
  }, [params.id, supabase])

  const handleToggleNumber = async (index: number) => {
    if (!raffle) return

    const updatedNumbers = [...raffle.numbers]
    const currentNumber = updatedNumbers[index]

    if (currentNumber.isTaken) {
      updatedNumbers[index] = { isTaken: false }
    } else {
      if (!participantName.trim()) {
        alert("Por favor ingresa el nombre del participante")
        return
      }
      updatedNumbers[index] = {
        isTaken: true,
        participantName: participantName.trim(),
      }
    }

    // TODO: Actualizar en Supabase
    setRaffle({
      ...raffle,
      numbers: updatedNumbers,
    })
  }

  const handleShareRaffle = () => {
    if (!raffle) return
    router.push(`/rifas/${raffle.id}`)
  }

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="h-8 w-48 animate-pulse rounded-md bg-muted" />
      </div>
    )
  }

  if (!raffle) {
    return (
      <div className="space-y-8">
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-semibold mb-2">Rifa no encontrada</h2>
            <p className="text-muted-foreground">
              La rifa que buscas no existe o no tienes permiso para verla.
            </p>
            <Button
              className="mt-4"
              variant="outline"
              onClick={() => router.push("/mis-rifas")}
            >
              Volver a Mis Rifas
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{raffle.title}</h1>
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => router.push(`/mis-rifas/${raffle.id}/edit`)}
          >
            Editar
          </Button>
          <Button onClick={handleShareRaffle}>Compartir</Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Gestionar Números</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <label className="text-sm font-medium mb-2 block">
              Nombre del participante
            </label>
            <Input
              placeholder="Ingresa el nombre antes de seleccionar un número"
              value={participantName}
              onChange={(e) => setParticipantName(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-10 gap-2">
            {raffle.numbers.map((number, index) => (
              <Button
                key={index}
                variant={number.isTaken ? "secondary" : "outline"}
                className="h-12 w-12 relative"
                onClick={() => handleToggleNumber(index)}
              >
                <span>{index + 1}</span>
                {number.isTaken && (
                  <div className="absolute -bottom-8 left-0 right-0 text-xs truncate">
                    {number.participantName}
                  </div>
                )}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Participantes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="divide-y">
            {raffle.numbers
              .filter((n) => n.isTaken)
              .map((number, index) => (
                <div key={index} className="py-2 flex justify-between">
                  <span>{number.participantName}</span>
                  <span className="text-muted-foreground">
                    Número {index + 1}
                  </span>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}