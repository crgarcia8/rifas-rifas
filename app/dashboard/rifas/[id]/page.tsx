"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RaffleService } from "@/lib/services";
import type { Raffle } from "@/types/raffle";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { ArrowLeft } from "lucide-react";

export default function PublicRafflePage() {
  const router = useRouter()
  const params = useParams();
  const [raffle, setRaffle] = useState<Raffle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRaffle = async () => {
      try {
        const raffleData = await RaffleService.getRaffle(params.id as string);
        setRaffle(raffleData);
      } catch (err) {
        console.error("Error fetching raffle:", err);
        setError(
          err instanceof Error ? err.message : "Error al cargar la rifa"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRaffle();
  }, [params.id]);

  if (loading) {
    return (
      <Container>
        <div className="py-8">
          <Card>
            <CardContent className="p-8">
              <div className="h-8 w-48 animate-pulse rounded-md bg-muted" />
            </CardContent>
          </Card>
        </div>
      </Container>
    );
  }

  if (!raffle) {
    return (
      <Container>
        <div className="py-8">
          <Card>
            <CardContent className="p-8 text-center">
              <h2 className="text-xl font-semibold mb-2">Rifa no encontrada</h2>
              <p className="text-muted-foreground">
                La rifa que buscas no existe o no está disponible.
              </p>
            </CardContent>
          </Card>
        </div>
      </Container>
    );
  }

  const onBack =()=>{
    router.push(`/dashboard`)

  }

  return (
    <Container>
      <div className="py-4">
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-8 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver
        </Button>

        <Card className="mb-8 shadow-lg border-0">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-foreground text-balance">
              {raffle.title}
            </CardTitle>
            <p className="text-lg text-muted-foreground text-pretty">
              {raffle.description}
            </p>
            <div className="flex gap-4 text-sm text-muted-foreground mt-4">
              <span className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: "var(--color-raffle-available)" }}
                ></div>
                Disponibles: 999{/* {availableCount} */}
              </span>
              <span className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: "var(--color-raffle-taken)" }}
                ></div>
                Ocupados: 999{/* {takenCount} */}
              </span>
              <div className="px-4 py-1 rounded-xl bg-green-600 text-white font-semibold shadow-sm">
                🎟 Costo:{" "}
                {new Intl.NumberFormat("es-CO", {
                  style: "currency",
                  currency: "COP",
                }).format(raffle.ticket_cost)}
              </div>
            </div>
            <Button className="w-full text-base font-medium" size="lg">
              Compartir Rifa
            </Button>
          </CardHeader>
        </Card>
        <div className="grid gap-4 md:grid-cols-[2fr,1fr]">
          <Card>
            <CardHeader>
              <CardTitle>Números disponibles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-10 gap-2">
                {Array.from(
                  { length: raffle.range_end - raffle.range_start + 1 },
                  (_, i) => (
                    <Button
                      key={i + raffle.range_start}
                      variant="outline"
                      className="h-16 w-full"
                    >
                      {i + raffle.range_start}
                    </Button>
                  )
                )}
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
        </div>
      </div>
    </Container>
  );
}
