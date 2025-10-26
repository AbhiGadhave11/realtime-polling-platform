export interface PollOption {
  id: string
  text: string
  votes: number
  percentage: number
}

export interface Poll {
  id: string
  title: string
  description?: string
  createdAt: string
  updatedAt: string
  options: PollOption[]
  totalVotes: number
  totalLikes: number
}

export interface CreatePollData {
  title: string
  description?: string
  options: string[]
}

