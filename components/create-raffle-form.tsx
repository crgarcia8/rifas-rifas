"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft } from "lucide-react"

interface CreateRaffleFormProps {
  onCreateRaffle: (title: string, description: string) => void
  onBack: () => void
}

export function CreateRaffleForm({ onCreateRaffle, onBack }: CreateRaffleFormProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (title.trim() && description.trim()) {
      onCreateRaffle(title.trim(), description.trim())
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Back Button */}
          <Button variant="ghost" onClick={onBack} className="mb-8 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al inicio
          </Button>

          {/* Form Card */}
          <Card className="shadow-lg border-0">
            <CardHeader className="text-center pb-8">
              <CardTitle className="text-3xl font-bold text-foreground">Crear nueva rifa</CardTitle>
              <p className="text-muted-foreground mt-2">Completa los datos para configurar tu rifa</p>
            </CardHeader>

            <CardContent className="px-8 pb-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-sm font-medium text-foreground">
                    Título de la rifa
                  </Label>
                  <Input
                    id="title"
                    type="text"
                    placeholder="Ej: Rifa de fin de año 2024"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="h-12 text-base"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-sm font-medium text-foreground">
                    Descripción breve
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Describe tu rifa, premio, fecha del sorteo, etc."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="min-h-[100px] text-base resize-none"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-foreground">Rango de números</Label>
                  <div className="flex items-center space-x-4 p-4 bg-muted rounded-lg">
                    <div className="flex-1">
                      <Input type="number" value="1" disabled className="bg-background" />
                      <Label className="text-xs text-muted-foreground mt-1 block">Desde</Label>
                    </div>
                    <div className="text-muted-foreground">hasta</div>
                    <div className="flex-1">
                      <Input type="number" value="100" disabled className="bg-background" />
                      <Label className="text-xs text-muted-foreground mt-1 block">Hasta</Label>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">Por ahora solo soportamos rifas de 1 a 100 números</p>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full h-14 text-lg font-semibold mt-8"
                  disabled={!title.trim() || !description.trim()}
                >
                  Generar rifa
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
