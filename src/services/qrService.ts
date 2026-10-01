import { api } from '@/utils/api'

export interface TodayTokenResponse {
  status: 'valid' | 'expired' | 'none' | 'unsubscribed'
  token?: string
  expires_at?: string
}

export interface GenerateTokenResponse {
  token: string
  expires_at: string
}

export interface ScanTokenResponse {
  message: string
  userId: string
}

export function getTodayToken(userId: string): Promise<TodayTokenResponse> {
  return api.get<TodayTokenResponse>(`/qr/today?userId=${userId}`)
}

export function generateToken(userId: string): Promise<GenerateTokenResponse> {
  return api.post<GenerateTokenResponse>('/qr/generate', { userId })
}

export function scanToken(token: string): Promise<ScanTokenResponse> {
  return api.post<ScanTokenResponse>('/qr/scan', { token })
}
