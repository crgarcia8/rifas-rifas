"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Eye, User } from "lucide-react"
import type { Raffle } from "@/app/page"

interface PublicRaffleViewProps {
  raffle: Raffle
  onBack: () => void
}

export function PublicRaffleView({ raffle, onBack }: PublicRaffleViewProps) {
  const takenCount = raffle.numbers.filter((number) => number.isTaken).length
  const availableCount = 100 - takenCount

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Button variant="ghost" onClick={onBack} className="mb-8 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al panel de control
          </Button>

          {/* Public View Badge */}
          <div className="flex items-center justify-center mb-6">
            <div className="flex items-center gap-2 px-4 py-2 bg-accent/10 text-accent rounded-full text-sm font-medium">
              <Eye className="w-4 h-4" />
              Vista pública - Solo lectura
            </div>
          </div>

          {/* Header Card */}
          <Card className="mb-8 shadow-lg border-0">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-foreground text-balance">{raffle.title}</CardTitle>
              <p className="text-lg text-muted-foreground text-pretty">{raffle.description}</p>
              <div className="flex gap-4 text-sm text-muted-foreground mt-4">
                <span className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: "var(--color-raffle-available)" }}
                  ></div>
                  Disponibles: {availableCount}
                </span>
                <span className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "var(--color-raffle-taken)" }}></div>
                  Ocupados: {takenCount}
                </span>
              </div>
            </CardHeader>
          </Card>

          {/* Numbers Grid - Read Only */}
          <Card className="mb-8 shadow-lg border-0">
            <CardContent className="p-6">
              <div className="grid grid-cols-10 gap-2">
                {raffle.numbers.map((number, index) => (
                  <div
                    key={index}
                    className={`
                      aspect-square rounded-lg border-2 font-semibold text-xs
                      flex flex-col items-center justify-center cursor-default p-1
                      ${number.isTaken ? "border-gray-300 text-gray-500" : "border-emerald-300 text-emerald-700"}
                    `}
                    style={{
                      backgroundColor: number.isTaken ? "var(--color-raffle-taken)" : "var(--color-raffle-available)",
                    }}
                    title={number.isTaken ? `Ocupado por: ${number.participantName}` : "Disponible"}
                  >
                    <span className="font-bold">{index + 1}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Info Message */}
          <Card className="bg-muted/50 border-0">
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground">
                Esta es la vista que verán los participantes de tu rifa. Los números no son interactivos en esta vista
                pública.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
