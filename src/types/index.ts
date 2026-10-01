export type UserRole = 'EMPLOYEE' | 'ADMIN'

export interface User {
  id: string
  fullName: string
  email: string
  role: UserRole
  permissions: string[]
}

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
}
