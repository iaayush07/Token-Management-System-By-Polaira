import { useEffect } from 'react'
import type { ReactNode } from 'react'
import { Center, Loader } from '@mantine/core'
import { Navigate, useLocation } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { setCredentials, logout, setLoading, setPermissionsLoaded } from '@/store/slices/authSlice'
import { getMe } from '@/services/authService'
import { ApiError, isTokenExpired } from '@/utils/api'

interface AuthGuardProps {
  children: ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const dispatch = useAppDispatch()
  const { token, permissionsLoaded, isLoading } = useAppSelector((state) => state.auth)
  const location = useLocation()

  useEffect(() => {
    if (!token) return

    if (isTokenExpired(token)) {
      dispatch(logout())
      return
    }

    if (permissionsLoaded) return

    dispatch(setLoading(true))
    getMe()
      .then((fetchedUser) => {
        dispatch(setCredentials({ user: fetchedUser, token }))
      })
      .catch((err) => {
        if (err instanceof ApiError && err.status === 401) {
          dispatch(logout())
        } else {
          // Network or server error: keep session alive, show empty-permissions shell
          dispatch(setPermissionsLoaded(true))
        }
      })
      .finally(() => {
        dispatch(setLoading(false))
      })
  }, [token, permissionsLoaded, dispatch])

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (!permissionsLoaded) {
    return (
      <Center mih="100vh">
        <Loader color="teal" />
      </Center>
    )
  }

  return <>{children}</>
}
