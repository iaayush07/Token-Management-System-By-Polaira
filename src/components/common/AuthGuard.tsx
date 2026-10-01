import { useEffect } from 'react'
import type { ReactNode } from 'react'
import { Center, Loader } from '@mantine/core'
import { Navigate, useLocation } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { setCredentials, logout, setLoading } from '@/store/slices/authSlice'
import { getMe } from '@/services/authService'
import { isTokenExpired } from '@/utils/api'

interface AuthGuardProps {
  children: ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const dispatch = useAppDispatch()
  const { token, user, isLoading } = useAppSelector((state) => state.auth)
  const location = useLocation()

  useEffect(() => {
    if (!token) return

    if (isTokenExpired(token)) {
      dispatch(logout())
      return
    }

    if (user) return

    dispatch(setLoading(true))
    getMe()
      .then((fetchedUser) => {
        dispatch(setCredentials({ user: fetchedUser, token }))
      })
      .catch(() => {
        dispatch(logout())
      })
      .finally(() => {
        dispatch(setLoading(false))
      })
  }, [token, user, dispatch])

  if (token && !user) {
    if (isLoading) {
      return (
        <Center mih="100vh">
          <Loader color="teal" />
        </Center>
      )
    }
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <>{children}</>
}
