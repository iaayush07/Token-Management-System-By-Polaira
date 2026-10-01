import { AppShell } from '@mantine/core'
import { Outlet } from 'react-router-dom'
import { AppHeader } from './AppHeader'
import { AppSidebar } from './AppSidebar'

export function AppLayout() {
  return (
    <AppShell
      header={{ height: 64 }}
      navbar={{ width: 260, breakpoint: 'sm' }}
      padding="xl"
    >
      <AppHeader />
      <AppSidebar />
      <AppShell.Main style={{ background: 'var(--mantine-color-gray-0)', minHeight: '100vh' }}>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  )
}
