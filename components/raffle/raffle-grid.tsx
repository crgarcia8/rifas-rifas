"use client"

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Card } from "../ui/card"
import { Button } from "../ui/button"
import type { Raffle } from "@/app/page"

interface RaffleGridProps {
  raffle: Raffle
  onToggleNumber: (index: number, participantName?: string) => void
  onShare?: () => void
  isPublic?: boolean
}

export function RaffleGrid({
  raffle,
  onToggleNumber,
  onShare,
  isPublic = false,
}: RaffleGridProps) {
  return (
    <Card className="p-6">
      <div className="grid grid-cols-10 gap-2">
        {raffle.numbers.map((number, index) => (
          <Button
            key={index}
            variant={number.isTaken ? "secondary" : "outline"}
            className="h-12 w-12 relative"
            onClick={() => onToggleNumber(index)}
            disabled={isPublic || number.isTaken}
          >
            <span>{index + 1}</span>
            {number.isTaken && number.participantName && (
              <div className="absolute -bottom-8 left-0 right-0 text-xs truncate">
                {number.participantName}
              </div>
            )}
          </Button>
        ))}
      </div>

      {!isPublic && onShare && (
        <div className="mt-8 flex justify-end">
          <Button onClick={onShare}>
            Compartir Rifa
          </Button>
        </div>
      )}
    </Card>
  )
}