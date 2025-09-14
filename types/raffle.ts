export interface Raffle {
  id: string
  title: string
  description: string | null
  goal: string | null
  range_start: number
  range_end: number
  ticket_cost: number
  creator_id: string
  created_at?: string
}

export interface CreateRaffleData {
  title: string
  description?: string
  goal?: string
  range_start?: number
  range_end?: number
  ticket_cost: number
}