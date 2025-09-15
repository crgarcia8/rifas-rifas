import type { Raffle } from "./raffle";

export interface RaffleNumber {
  id: string;
  raffle_id: string;
  number: number;
  participant_name: string;
  created_at: string;
}
