"use client";

import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus, Box, Settings, Share2, Trash2 } from "lucide-react";
import type { Raffle } from "@/types/raffle";

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [raffles, setRaffles] = useState<Raffle[]>([]);
  const supabase = createClientComponentClient();

  useEffect(() => {
    const fetchRaffles = async () => {
      try {
        const { data: userRaffles, error } = await supabase
          .from('tbl_raffle')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          throw error;
        }

        setRaffles(userRaffles || []);
      } catch (error) {
        console.error('Error fetching raffles:', error);
        // TODO: Show error message to user
      } finally {
        setIsLoading(false);
      }
    };

    fetchRaffles();
  }, [supabase]);

  const handleDeleteRaffle = async (raffleId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta rifa?')) return;

    try {
      const { error } = await supabase
        .from('tbl_raffle')
        .delete()
        .match({ id: raffleId });

      if (error) throw error;

      // Update local state to remove the deleted raffle
      setRaffles(raffles.filter(raffle => raffle.id !== raffleId));
    } catch (error) {
      console.error('Error deleting raffle:', error);
      // TODO: Show error message to user
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(amount);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Mis Rifas</h1>
            <Link href="/?view=create" passHref>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Nueva Rifa
              </Button>
            </Link>
          </div>

          {/* Content */}
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-muted-foreground">Cargando tus rifas...</p>
            </div>
          ) : raffles.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Box className="w-12 h-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No tienes rifas creadas</h3>
                <p className="text-muted-foreground text-center mb-6">
                  Crea tu primera rifa para comenzar a vender números
                </p>
                <Link href="/?view=create" passHref>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Crear mi primera rifa
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {raffles.map((raffle) => (
                <Card key={raffle.id} className="flex flex-col">
                  <CardHeader>
                    <CardTitle>{raffle.title}</CardTitle>
                    {raffle.description && (
                      <p className="text-sm text-muted-foreground mt-2">
                        {raffle.description}
                      </p>
                    )}
                  </CardHeader>
                  <CardContent className="flex-1">
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-medium">Precio por número</p>
                        <p className="text-2xl font-bold">{formatCurrency(raffle.ticket_cost)}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Rango</p>
                        <p className="text-muted-foreground">
                          {raffle.range_start} al {raffle.range_end}
                        </p>
                      </div>
                      {raffle.goal && (
                        <div>
                          <p className="text-sm font-medium">Meta</p>
                          <p className="text-muted-foreground">{raffle.goal}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <div className="p-6 pt-0 mt-auto">
                    <div className="flex space-x-2">
                      <Link href={`/dashboard/rifas/${raffle.id}`} passHref className="flex-1">
                        <Button variant="default" className="w-full">
                          <Box className="w-4 h-4 mr-2" />
                          Ver Rifa
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="icon"
                        asChild
                      >
                        <Link href={`/dashboard/rifas/${raffle.id}/settings`}>
                          <Settings className="w-4 h-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {/* TODO: Implement share */}}
                      >
                        <Share2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleDeleteRaffle(raffle.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
  );
}