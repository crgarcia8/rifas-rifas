"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Share2, Download } from "lucide-react"
import type { Raffle } from "@/app/page"

interface RaffleViewProps {
  raffle: Raffle
  onToggleNumber: (index: number) => void
  onShare: () => void
  onBack: () => void
}

export function RaffleView({ raffle, onToggleNumber, onShare, onBack }: RaffleViewProps) {
  const takenCount = raffle.numbers.filter((taken) => taken).length
  const availableCount = 100 - takenCount

  const handleDownloadImage = () => {
    // Simple implementation - in a real app you'd generate an actual image
    alert("Función de descarga de imagen - próximamente")
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Button variant="ghost" onClick={onBack} className="mb-8 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al inicio
          </Button>

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

          {/* Numbers Grid */}
          <Card className="mb-8 shadow-lg border-0">
            <CardContent className="p-6">
              <div className="grid grid-cols-10 gap-2">
                {raffle.numbers.map((isTaken, index) => (
                  <button
                    key={index}
                    onClick={() => onToggleNumber(index)}
                    className={`
                      aspect-square rounded-lg border-2 font-semibold text-sm
                      transition-all duration-200 hover:scale-105 active:scale-95
                      ${
                        isTaken
                          ? "border-gray-300 text-gray-500"
                          : "border-emerald-300 text-emerald-700 hover:border-emerald-400 hover:bg-emerald-50"
                      }
                    `}
                    style={{
                      backgroundColor: isTaken ? "var(--color-raffle-taken)" : "var(--color-raffle-available)",
                    }}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              variant="outline"
              size="lg"
              onClick={onShare}
              className="flex-1 h-14 text-base font-semibold bg-transparent"
            >
              <Share2 className="w-5 h-5 mr-2" />
              Compartir link
            </Button>
            <Button size="lg" onClick={handleDownloadImage} className="flex-1 h-14 text-base font-semibold">
              <Download className="w-5 h-5 mr-2" />
              Descargar imagen
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
