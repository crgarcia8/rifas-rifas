import type { CreateRaffleData, Raffle } from "@/types/raffle";

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

const API_BASE = "/api";

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Error desconocido' }));
    throw new ApiError(response.status, error.error || 'Error en la solicitud');
  }
  return response.json();
}

export const RaffleService = {
  // Crear una nueva rifa
  async createRaffle(data: CreateRaffleData): Promise<Raffle> {
    const response = await fetch(`${API_BASE}/raffles`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    return handleResponse<Raffle>(response);
  },

  // Obtener todas las rifas del usuario
  async getRaffles(): Promise<Raffle[]> {
    const response = await fetch(`${API_BASE}/raffles`);
    return handleResponse<Raffle[]>(response);
  },

  // Obtener una rifa específica
  async getRaffle(id: string): Promise<Raffle> {
    const response = await fetch(`${API_BASE}/raffles/${id}`);
    return handleResponse<Raffle>(response);
  },

  // Eliminar una rifa
  async deleteRaffle(id: string): Promise<void> {
    const response = await fetch(`${API_BASE}/raffles/${id}`, {
      method: "DELETE",
    });
    return handleResponse<void>(response);
  },
};