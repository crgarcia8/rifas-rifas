"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RaffleService } from "@/lib/services";
import type { Raffle } from "@/types/raffle";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ParticipantDialogProps {
  number: number;
  isOpen: boolean;
  onClose: () => void;
  onSave: (number: number, participantName: string) => void;
}

function ParticipantDialog({ number, isOpen, onClose, onSave }: ParticipantDialogProps) {
  const [participantName, setParticipantName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (participantName.trim()) {
      onSave(number, participantName.trim());
      setParticipantName("");
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Asignar Número {number}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="participantName">Nombre del participante</Label>
            <Input
              id="participantName"
              value={participantName}
              onChange={(e) => setParticipantName(e.target.value)}
              placeholder="Ingrese el nombre del participante"
              autoFocus
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={!participantName.trim()}>
              Guardar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

interface RaffleNumber {
  number: number;
  participantName?: string;
  isTaken: boolean;
}

export default function ManageRafflePage() {
  const params = useParams();
  const [raffle, setRaffle] = useState<Raffle | null>(null);
  const [numbers, setNumbers] = useState<RaffleNumber[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);

  useEffect(() => {
    const fetchRaffle = async () => {
      try {
        const raffleData = await RaffleService.getRaffle(params.id as string);
        setRaffle(raffleData);
        // Inicializar números
        setNumbers(
          Array.from(
            { length: raffleData.range_end - raffleData.range_start + 1 },
            (_, i) => ({
              number: i + raffleData.range_start,
              isTaken: false,
            })
          )
        );
      } catch (err) {
        console.error('Error fetching raffle:', err);
        setError(err instanceof Error ? err.message : 'Error al cargar la rifa');
      } finally {
        setLoading(false);
      }
    };

    fetchRaffle();
  }, [params.id]);

  const handleNumberClick = (number: number) => {
    const existingNumber = numbers.find(n => n.number === number);
    if (existingNumber?.isTaken) {
      // Si ya está tomado, lo liberamos
      setNumbers(numbers.map(n =>
        n.number === number
          ? { ...n, isTaken: false, participantName: undefined }
          : n
      ));
    } else {
      // Si está libre, abrimos el diálogo
      setSelectedNumber(number);
    }
  };

  const handleSaveParticipant = (number: number, participantName: string) => {
    setNumbers(numbers.map(n =>
      n.number === number
        ? { ...n, isTaken: true, participantName }
        : n
    ));
    // TODO: Aquí iría la llamada a la API para guardar el cambio
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full"></div>
        </div>
      </div>
    );
  }

  if (error || !raffle) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-semibold mb-2">Error</h2>
            <p className="text-muted-foreground">
              {error || 'La rifa no fue encontrada'}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Gestionar números - {raffle.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-10 gap-2">
            {numbers.map((numberData) => (
              <Button
                key={numberData.number}
                variant={numberData.isTaken ? "secondary" : "outline"}
                className="h-12 w-full relative group"
                onClick={() => handleNumberClick(numberData.number)}
              >
                <span>{numberData.number}</span>
                {numberData.isTaken && numberData.participantName && (
                  <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-background border px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                    {numberData.participantName}
                  </div>
                )}
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

      <ParticipantDialog
        number={selectedNumber || 0}
        isOpen={selectedNumber !== null}
        onClose={() => setSelectedNumber(null)}
        onSave={handleSaveParticipant}
      />
    </div>
  );
}