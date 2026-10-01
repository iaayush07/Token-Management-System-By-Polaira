import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { AuthState, User } from '@/types'
import { isTokenExpired } from '@/utils/api'

const TOKEN_KEY = 'tms_token'
const USER_KEY = 'tms_user'

function loadFromStorage(): Pick<AuthState, 'user' | 'token' | 'permissionsLoaded'> {
  try {
    const token = localStorage.getItem(TOKEN_KEY)
    if (token && isTokenExpired(token)) {
      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem(USER_KEY)
      return { token: null, user: null, permissionsLoaded: false }
    }
    const userRaw = localStorage.getItem(USER_KEY)
    const user: User | null = userRaw ? (JSON.parse(userRaw) as User) : null
    return { token, user, permissionsLoaded: !!user }
  } catch {
    return { token: null, user: null, permissionsLoaded: false }
  }
}

const { token, user, permissionsLoaded } = loadFromStorage()

const initialState: AuthState = {
  user,
  token,
  isAuthenticated: !!token && !!user,
  isLoading: false,
  permissionsLoaded,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials(state, action: PayloadAction<{ user: User; token: string }>) {
      state.user = action.payload.user
      state.token = action.payload.token
      state.isAuthenticated = true
      state.permissionsLoaded = true
      localStorage.setItem(TOKEN_KEY, action.payload.token)
      localStorage.setItem(USER_KEY, JSON.stringify(action.payload.user))
    },
    updateUser(state, action: PayloadAction<User>) {
      state.user = action.payload
      localStorage.setItem(USER_KEY, JSON.stringify(action.payload))
    },
    logout(state) {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      state.permissionsLoaded = false
      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem(USER_KEY)
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload
    },
    setPermissionsLoaded(state, action: PayloadAction<boolean>) {
      state.permissionsLoaded = action.payload
    },
  },
})

export const { setCredentials, updateUser, logout, setLoading, setPermissionsLoaded } = authSlice.actions
export default authSlice.reducer
