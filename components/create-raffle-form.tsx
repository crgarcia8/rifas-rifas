"use client";

import { useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft } from "lucide-react";
import type { CreateRaffleData } from "@/types/raffle";

interface CreateRaffleFormProps {
  onBack: () => void;
}

export function CreateRaffleForm({
  onBack,
}: CreateRaffleFormProps) {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<CreateRaffleData>({
    title: "",
    description: "",
    goal: "",
    range_start: 1,
    range_end: 100,
    ticket_cost: 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || formData.ticket_cost <= 0) return;

    setIsSubmitting(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        throw new Error("No user found");
      }

      const { data: raffle, error } = await supabase
        .from('tbl_raffle')
        .insert({
          ...formData,
          creator_id: userData.user.id,
        })
        .select()
        .single();

      if (error) throw error;

      // Navigate to the dashboard after successful creation
      router.push('/dashboard');
    } catch (error) {
      console.error('Error creating raffle:', error);
      // TODO: Show error message to user
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={onBack}
            className="mb-8 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al inicio
          </Button>

          {/* Form Card */}
          <Card className="shadow-lg border-0">
            <CardHeader className="text-center pb-8">
              <CardTitle className="text-3xl font-bold text-foreground">
                Crear nueva rifa
              </CardTitle>
              <p className="text-muted-foreground mt-2">
                Completa los datos para configurar tu rifa
              </p>
            </CardHeader>

            <CardContent className="px-8 pb-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="title"
                    className="text-sm font-medium text-foreground"
                  >
                    Título de la rifa
                  </Label>
                  <Input
                    id="title"
                    type="text"
                    placeholder="Ej: Rifa de fin de año 2024"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="h-12 text-base"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="description"
                    className="text-sm font-medium text-foreground"
                  >
                    Descripción breve
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Describe tu rifa, premio, fecha del sorteo, etc."
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="min-h-[100px] text-base resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="goal"
                    className="text-sm font-medium text-foreground"
                  >
                    Meta (opcional)
                  </Label>
                  <Input
                    id="goal"
                    type="text"
                    placeholder="Ej: Compra de equipamiento deportivo"
                    value={formData.goal || ""}
                    onChange={(e) => setFormData({...formData, goal: e.target.value})}
                    className="h-12 text-base"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-foreground">
                    Rango de números
                  </Label>
                  <div className="flex items-center space-x-4 p-4 bg-muted rounded-lg">
                    <div className="flex-1">
                      <Input
                        type="number"
                        value="1"
                        disabled
                        className="bg-background"
                      />
                      <Label className="text-xs text-muted-foreground mt-1 block">
                        Desde
                      </Label>
                    </div>
                    <div className="text-muted-foreground">hasta</div>
                    <div className="flex-1">
                      <Input
                        type="number"
                        value="100"
                        disabled
                        className="bg-background"
                      />
                      <Label className="text-xs text-muted-foreground mt-1 block">
                        Hasta
                      </Label>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Por ahora solo soportamos rifas de 1 a 100 números
                  </p>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="ticket_cost"
                    className="text-sm font-medium text-foreground"
                  >
                    Precio por número
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                      $
                    </span>
                    <Input
                      id="ticket_cost"
                      type="number"
                      min="1"
                      step="0.01"
                      placeholder="0.00"
                      value={formData.ticket_cost || ""}
                      onChange={(e) => setFormData({...formData, ticket_cost: parseFloat(e.target.value) || 0})}
                      className="pl-8 h-12 text-base"
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full h-14 text-lg font-semibold mt-8"
                  disabled={isSubmitting || !formData.title.trim() || formData.ticket_cost <= 0}
                >
                  {isSubmitting ? "Creando..." : "Generar rifa"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
