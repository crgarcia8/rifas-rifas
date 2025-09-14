"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Share2, Download, User } from "lucide-react"
import { useState } from "react"
import type { Raffle } from "@/app/page"

interface RaffleViewProps {
  raffle: Raffle
  onToggleNumber: (index: number, participantName?: string) => void
  onShare: () => void
  onBack: () => void
}

export function RaffleView({ raffle, onToggleNumber, onShare, onBack }: RaffleViewProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null)
  const [participantName, setParticipantName] = useState("")

  const takenCount = raffle.numbers.filter((number) => number.isTaken).length
  const availableCount = 100 - takenCount

  const handleDownloadImage = () => {
    // Simple implementation - in a real app you'd generate an actual image
    alert("Función de descarga de imagen - próximamente")
  }

  const handleNumberClick = (index: number) => {
    const number = raffle.numbers[index]

    if (number.isTaken) {
      // If already taken, toggle it back to available
      onToggleNumber(index)
    } else {
      // If available, open modal to get participant name
      setSelectedNumber(index)
      setParticipantName("")
      setIsModalOpen(true)
    }
  }

  const handleModalConfirm = () => {
    if (selectedNumber !== null) {
      onToggleNumber(selectedNumber, participantName.trim() || undefined)
      setIsModalOpen(false)
      setSelectedNumber(null)
      setParticipantName("")
    }
  }

  const handleModalCancel = () => {
    setIsModalOpen(false)
    setSelectedNumber(null)
    setParticipantName("")
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
                {raffle.numbers.map((number, index) => (
                  <button
                    key={index}
                    onClick={() => handleNumberClick(index)}
                    className={`
                      aspect-square rounded-lg border-2 font-semibold text-xs
                      transition-all duration-200 hover:scale-105 active:scale-95
                      flex flex-col items-center justify-center p-1
                      ${
                        number.isTaken
                          ? "border-gray-300 text-gray-500"
                          : "border-emerald-300 text-emerald-700 hover:border-emerald-400 hover:bg-emerald-50"
                      }
                    `}
                    style={{
                      backgroundColor: number.isTaken ? "var(--color-raffle-taken)" : "var(--color-raffle-available)",
                    }}
                    title={number.isTaken ? `Ocupado por: ${number.participantName}` : "Disponible"}
                  >
                    <span className="font-bold">{index + 1}</span>
                    {number.isTaken && (
                      <div className="flex items-center justify-center mt-0.5">
                        {number.participantName ? (
                          <span className="text-[8px] leading-none truncate max-w-full">
                            {number.participantName.split(" ")[0]}
                          </span>
                        ) : (
                          <User className="w-2 h-2" />
                        )}
                      </div>
                    )}
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

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              Número {selectedNumber !== null ? selectedNumber + 1 : ""}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="participant-name" className="text-sm font-medium">
                Nombre del participante
              </Label>
              <Input
                id="participant-name"
                placeholder="Ingresa el nombre..."
                value={participantName}
                onChange={(e) => setParticipantName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleModalConfirm()
                  }
                }}
                autoFocus
                className="w-full"
              />
            </div>
            <p className="text-sm text-muted-foreground">Este número quedará marcado como ocupado por esta persona.</p>
          </div>
          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={handleModalCancel}>
              Cancelar
            </Button>
            <Button onClick={handleModalConfirm}>Confirmar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
