"use client"

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Raffle } from "@/app/page"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default function EditRafflePage() {
  const params = useParams()
  const router = useRouter()
  const [raffle, setRaffle] = useState<Raffle | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const supabase = createClientComponentClient()

  useEffect(() => {
    const fetchRaffle = async () => {
      // TODO: Implementar la carga de la rifa desde Supabase
      setLoading(false)
    }

    fetchRaffle()
  }, [params.id, supabase])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!raffle) return

    setSaving(true)
    try {
      // TODO: Actualizar en Supabase
      router.push(`/mis-rifas/${params.id}`)
    } catch (error) {
      console.error("Error al guardar:", error)
      alert("Error al guardar los cambios")
    } finally {
      setSaving(false)
    }
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
              La rifa que buscas no existe o no tienes permiso para editarla.
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
        <h1 className="text-3xl font-bold">Editar Rifa</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Información de la Rifa</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título</Label>
              <Input
                id="title"
                value={raffle.title}
                onChange={(e) =>
                  setRaffle({ ...raffle, title: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                value={raffle.description}
                onChange={(e) =>
                  setRaffle({ ...raffle, description: e.target.value })
                }
                required
              />
            </div>

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? "Guardando..." : "Guardar cambios"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}