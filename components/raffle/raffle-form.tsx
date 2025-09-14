"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { CreateRaffleData } from "@/types/raffle"
import { useState } from "react"

interface CreateRaffleFormProps {
  onCreateRaffle: (data: CreateRaffleData) => Promise<void>
  onBack: () => void
}

export function CreateRaffleForm({ onCreateRaffle, onBack }: CreateRaffleFormProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<CreateRaffleData>({
    title: "",
    description: "",
    goal: "",
    range_start: 1,
    range_end: 100,
    ticket_cost: 1
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await onCreateRaffle(formData)
    } catch (error) {
      console.error("Error creating raffle:", error)
      alert("Error al crear la rifa")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="container max-w-2xl mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Crear Nueva Rifa</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="goal">Objetivo de la rifa</Label>
            <Textarea
              id="goal"
              value={formData.goal}
              onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
              placeholder="¿Para qué estás recaudando fondos?"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="range_start">Número inicial</Label>
              <Input
                id="range_start"
                type="number"
                min={1}
                value={formData.range_start}
                onChange={(e) => setFormData({ ...formData, range_start: parseInt(e.target.value) })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="range_end">Número final</Label>
              <Input
                id="range_end"
                type="number"
                min={1}
                value={formData.range_end}
                onChange={(e) => setFormData({ ...formData, range_end: parseInt(e.target.value) })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="ticket_cost">Precio por número</Label>
            <Input
              id="ticket_cost"
              type="number"
              min="0.01"
              step="0.01"
              value={formData.ticket_cost}
              onChange={(e) => setFormData({ ...formData, ticket_cost: parseFloat(e.target.value) })}
              required
            />
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <Button type="button" variant="outline" onClick={onBack}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creando..." : "Crear Rifa"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  )
}