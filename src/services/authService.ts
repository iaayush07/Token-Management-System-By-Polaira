import { api } from '@/utils/api'
import type { User, UserRole } from '@/types'

export interface SignupInput {
  fullName: string
  email: string
  password: string
  role: UserRole
}

export interface SignupResponse {
  id: string
  fullName: string
  email: string
  role: UserRole
}

export interface LoginInput {
  email: string
  password: string
}

export interface LoginResponse {
  token: string
}

export function signup(input: SignupInput): Promise<SignupResponse> {
  return api.post<SignupResponse>('/auth/signup', input)
}

export function login(input: LoginInput): Promise<LoginResponse> {
  return api.post<LoginResponse>('/auth/login', input)
}

export function getMe(): Promise<User> {
  return api.get<User>('/auth/me')
}
