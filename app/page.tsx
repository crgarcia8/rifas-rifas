"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { User } from "@supabase/supabase-js";
import { CreateRaffleForm } from "@/components/create-raffle-form";
import { RaffleView } from "@/components/raffle-view";
import { PublicRaffleView } from "@/components/public-raffle-view";
import { GoogleSignInButton } from "@/components/ui/google-signin-button";
import { signInWithGoogle } from "@/lib/auth";
import { NavUserProfile } from "@/components/nav-user-profile";
import RenderFromTemplateContext from "next/dist/client/components/render-from-template-context";
import { MainLayout } from "@/components/main-layout";

export interface RaffleNumber {
  isTaken: boolean;
  participantName?: string;
}

export interface Raffle {
  id: string;
  title: string;
  description: string;
  numbers: RaffleNumber[]; // Updated to include participant info
  isPublic?: boolean;
}

export default function HomePage() {
  const [currentView, setCurrentView] = useState<
    "home" | "create" | "view" | "public"
  >("home");
  const [currentRaffle, setCurrentRaffle] = useState<Raffle | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const supabase = createClientComponentClient();

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };

    fetchUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (!session?.user) {
        setCurrentView("home");
        setCurrentRaffle(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase.auth]);

  const handleCreateRaffle = (title: string, description: string) => {
    const newRaffle: Raffle = {
      id: Date.now().toString(),
      title,
      description,
      numbers: new Array(100).fill(null).map(() => ({ isTaken: false })),
    };
    setCurrentRaffle(newRaffle);
    setCurrentView("view");
  };

  const handleToggleNumber = (index: number, participantName?: string) => {
    if (!currentRaffle) return;
    const updatedNumbers = [...currentRaffle.numbers];
    const currentNumber = updatedNumbers[index];

    if (currentNumber.isTaken) {
      // If taken, make it available and remove participant name
      updatedNumbers[index] = { isTaken: false };
    } else {
      // If available, mark as taken with participant name
      updatedNumbers[index] = {
        isTaken: true,
        participantName: participantName || "Sin nombre",
      };
    }

    setCurrentRaffle({
      ...currentRaffle,
      numbers: updatedNumbers,
    });
  };

  const handleShareRaffle = () => {
    if (!currentRaffle) return;

    const publicRaffle = { ...currentRaffle, isPublic: true };
    setCurrentRaffle(publicRaffle);
    setCurrentView("public");
  };

  const handleBackToHome = () => {
    setCurrentView("home");
    setCurrentRaffle(null);
  };

  // const renderContent = () => {
  if (currentView === "create") {
    return (
      <MainLayout>
        <CreateRaffleForm
          onCreateRaffle={handleCreateRaffle}
          onBack={handleBackToHome}
        />
      </MainLayout>
    );
  }

  if (currentView === "view" && currentRaffle) {
    return (
      <MainLayout>
        <RaffleView
          raffle={currentRaffle}
          onToggleNumber={handleToggleNumber}
          onShare={handleShareRaffle}
          onBack={handleBackToHome}
        />
      </MainLayout>
    );
  }

  if (currentView === "public" && currentRaffle) {
    return (
      <MainLayout>
        <PublicRaffleView raffle={currentRaffle} onBack={handleBackToHome} />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-5xl font-bold text-foreground mb-4 text-balance">
              Creador de Rifas
            </h1>
            <p className="text-xl text-muted-foreground text-pretty">
              Crea y comparte rifas fácilmente en segundos
            </p>
          </div>

          {/* Main Action Card */}
          <Card className="p-8 shadow-lg border-0 bg-card">
            <CardContent className="p-0">
              <div className="space-y-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg
                    className="w-8 h-8 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"
                    />
                  </svg>
                </div>

                <div className="space-y-4">
                  <h2 className="text-2xl font-semibold text-card-foreground">
                    ¿Listo para crear tu rifa?
                  </h2>
                  <p className="text-muted-foreground">
                    Configura tu rifa en minutos y compártela con tus
                    participantes
                  </p>
                </div>

                <div className="space-y-4">
                  {user ? (
                    <Button
                      size="lg"
                      className="w-full h-14 text-lg font-semibold"
                      onClick={() => setCurrentView("create")}
                    >
                      Crear rifa
                    </Button>
                  ) : (
                    <>
                      <Button
                        size="lg"
                        className="w-full h-14 text-lg font-semibold"
                        onClick={() => setCurrentView("create")}
                        // disabled
                      >
                        Crear rifa
                      </Button>
                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                          <span className="bg-card px-2 text-muted-foreground">
                            Inicia sesión para crear
                          </span>
                        </div>
                      </div>
                      <GoogleSignInButton onClick={signInWithGoogle} />
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6 mt-16">
            <div className="text-center">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-6 h-6 text-accent"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="font-semibold text-foreground mb-2">
                Rápido y fácil
              </h3>
              <p className="text-sm text-muted-foreground">
                Crea rifas en segundos con nuestra interfaz intuitiva
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-6 h-6 text-accent"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                  />
                </svg>
              </div>
              <h3 className="font-semibold text-foreground mb-2">
                Fácil de compartir
              </h3>
              <p className="text-sm text-muted-foreground">
                Comparte el enlace y deja que participen
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-6 h-6 text-accent"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h3 className="font-semibold text-foreground mb-2">
                Control total
              </h3>
              <p className="text-sm text-muted-foreground">
                Gestiona los números y ve el progreso en tiempo real
              </p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
