"use client";

import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { MainLayout } from "@/components/main-layout";
import { CreateRaffleForm } from "@/components/create-raffle-form";
import { redirect, useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";

export default function CreateRafflePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClientComponentClient();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        setUser(user);
        setIsLoading(false);

        // Si no hay usuario autenticado, redirigir al inicio
        if (!user) {
          redirect("/");
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        redirect("/");
      }
    };

    fetchUser();
  }, [supabase.auth]);

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full"></div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <CreateRaffleForm onBack={() => router.push("/")} />
    </MainLayout>
  );
}
