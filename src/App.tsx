import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import { AuthGuard } from '@/components/common/AuthGuard'
import { PermissionGuard } from '@/components/common/PermissionGuard'
import { PERMISSIONS } from '@/constants/permissions'

import LoginPage from '@/pages/LoginPage'
import SignupPage from '@/pages/SignupPage'
import DashboardPage from '@/pages/DashboardPage'
import MonthlySubscriptionPage from '@/pages/MonthlySubscriptionPage'
import TodaysTokenPage from '@/pages/TodaysTokenPage'
import MonthConfigurationPage from '@/pages/admin/MonthConfigurationPage'
import ScanTokenPage from '@/pages/admin/ScanTokenPage'
import ReportsPage from '@/pages/admin/ReportsPage'
import AccessDeniedPage from '@/pages/AccessDeniedPage'
import NotFoundPage from '@/pages/NotFoundPage'

export default function App() {
  const basename = new URL(document.baseURI).pathname.replace(/\/[^/]*$/, '') || '/'
  return (
    <BrowserRouter basename={basename}>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/access-denied" element={<AccessDeniedPage />} />

        {/* Protected shell routes */}
        <Route
          element={
            <AuthGuard>
              <AppLayout />
            </AuthGuard>
          }
        >
          <Route
            path="/dashboard"
            element={
              <PermissionGuard permission={PERMISSIONS.DASHBOARD}>
                <DashboardPage />
              </PermissionGuard>
            }
          />
          <Route
            path="/monthly-subscription"
            element={
              <PermissionGuard permission={PERMISSIONS.MONTHLY_SUBSCRIPTION}>
                <MonthlySubscriptionPage />
              </PermissionGuard>
            }
          />
          <Route
            path="/todays-token"
            element={
              <PermissionGuard permission={PERMISSIONS.TODAYS_TOKEN}>
                <TodaysTokenPage />
              </PermissionGuard>
            }
          />
          <Route
            path="/admin/month-configuration"
            element={
              <PermissionGuard permission={PERMISSIONS.MONTH_CONFIGURATION}>
                <MonthConfigurationPage />
              </PermissionGuard>
            }
          />
          <Route
            path="/admin/scan-token"
            element={
              <PermissionGuard permission={PERMISSIONS.SCAN_TOKEN}>
                <ScanTokenPage />
              </PermissionGuard>
            }
          />
          <Route
            path="/admin/reports"
            element={
              <PermissionGuard permission={PERMISSIONS.REPORTS}>
                <ReportsPage />
              </PermissionGuard>
            }
          />
        </Route>

        {/* Default redirects */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}
