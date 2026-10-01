import { api } from '@/utils/api'

export interface Subscription {
  id: string
  planName: string
  status: 'ACTIVE' | 'INACTIVE'
  startDate: string
  endDate: string | null
  userId: string
  user: {
    fullName: string
    email: string
  }
}

export interface SaveSubscriptionInput {
  userId: string
  planName: string
  status: 'ACTIVE' | 'INACTIVE'
  startDate: string
  endDate?: string | null
}

export function getSubscriptions(month: string): Promise<Subscription[]> {
  return api.get<Subscription[]>(`/subscriptions?month=${month}`)
}

export function saveSubscription(input: SaveSubscriptionInput): Promise<{ message: string }> {
  return api.post<{ message: string }>('/subscriptions', input)
}
