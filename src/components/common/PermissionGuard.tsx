import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAppSelector } from '@/store/hooks'
import type { Permission } from '@/constants/permissions'

interface PermissionGuardProps {
  permission: Permission
  children: ReactNode
}

export function PermissionGuard({ permission, children }: PermissionGuardProps) {
  const user = useAppSelector((state) => state.auth.user)
  const hasPermission = user?.permissions.includes(permission) ?? false

  if (!hasPermission) {
    return <Navigate to="/access-denied" replace />
  }

  return <>{children}</>
}
