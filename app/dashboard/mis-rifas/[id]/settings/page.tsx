"use client"

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Raffle } from "@/types/raffle"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

interface RaffleSettings {
  isPublic: boolean
  allowReservations: boolean
  requirePayment: boolean
  pricePerNumber: number
  maxNumbersPerPerson: number
}

export default function RaffleSettingsPage() {
  const params = useParams()
  const router = useRouter()
  const [raffle, setRaffle] = useState<Raffle | null>(null)
  const [settings, setSettings] = useState<RaffleSettings>({
    isPublic: false,
    allowReservations: false,
    requirePayment: false,
    pricePerNumber: 0,
    maxNumbersPerPerson: 0,
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const supabase = createClientComponentClient()

  useEffect(() => {
    const fetchRaffle = async () => {
      // TODO: Implementar la carga de la rifa y sus configuraciones desde Supabase
      setLoading(false)
    }

    fetchRaffle()
  }, [params.id, supabase])

  const handleSaveSettings = async () => {
    setSaving(true)
    try {
      // TODO: Guardar configuraciones en Supabase
      router.refresh()
    } catch (error) {
      console.error("Error al guardar configuraciones:", error)
      alert("Error al guardar las configuraciones")
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteRaffle = async () => {
    try {
      // TODO: Eliminar rifa en Supabase
      router.push("/mis-rifas")
    } catch (error) {
      console.error("Error al eliminar la rifa:", error)
      alert("Error al eliminar la rifa")
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
              La rifa que buscas no existe o no tienes permiso para configurarla.
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
        <h1 className="text-3xl font-bold">Configuración de la Rifa</h1>
      </div>

      <div className="grid gap-6">
        {/* Visibilidad */}
        <Card>
          <CardHeader>
            <CardTitle>Visibilidad</CardTitle>
            <CardDescription>
              Controla quién puede ver y participar en tu rifa
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Rifa pública</Label>
                <p className="text-sm text-muted-foreground">
                  Permite que cualquier persona con el enlace pueda ver la rifa
                </p>
              </div>
              <Switch
                checked={settings.isPublic}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, isPublic: checked })
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Participación */}
        <Card>
          <CardHeader>
            <CardTitle>Reglas de participación</CardTitle>
            <CardDescription>
              Configura cómo los participantes pueden interactuar con la rifa
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Permitir reservas</Label>
                <p className="text-sm text-muted-foreground">
                  Los participantes pueden reservar números sin pagar inmediatamente
                </p>
              </div>
              <Switch
                checked={settings.allowReservations}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, allowReservations: checked })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Máximo de números por persona</Label>
              <Input
                type="number"
                min="0"
                value={settings.maxNumbersPerPerson}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    maxNumbersPerPerson: parseInt(e.target.value) || 0,
                  })
                }
              />
              <p className="text-sm text-muted-foreground">
                0 = sin límite
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Pagos */}
        <Card>
          <CardHeader>
            <CardTitle>Configuración de pagos</CardTitle>
            <CardDescription>
              Establece las reglas de pago para tu rifa
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Requerir pago</Label>
                <p className="text-sm text-muted-foreground">
                  Los números solo se asignarán después del pago
                </p>
              </div>
              <Switch
                checked={settings.requirePayment}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, requirePayment: checked })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Precio por número</Label>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={settings.pricePerNumber}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    pricePerNumber: parseFloat(e.target.value) || 0,
                  })
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Botones de acción */}
        <div className="flex justify-between">
          <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
            <DialogTrigger asChild>
              <Button variant="destructive">Eliminar rifa</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>¿Estás seguro?</DialogTitle>
                <DialogDescription>
                  Esta acción no se puede deshacer. Se eliminará permanentemente la rifa
                  y todos sus datos asociados.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteDialog(false)}
                >
                  Cancelar
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDeleteRaffle}
                >
                  Eliminar
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={() => router.push(`/mis-rifas/${params.id}`)}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSaveSettings}
              disabled={saving}
            >
              {saving ? "Guardando..." : "Guardar cambios"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}