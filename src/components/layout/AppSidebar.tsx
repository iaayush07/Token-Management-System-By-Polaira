import { AppShell, Box, Text, UnstyledButton, Stack } from '@mantine/core'
import { Link, useLocation } from 'react-router-dom'
import {
  IconGauge,
  IconCalendar,
  IconTicket,
  IconCalendarStats,
  IconScan,
  IconChartBar,
  type Icon,
} from '@tabler/icons-react'
import { useAppSelector } from '@/store/hooks'
import { PERMISSIONS } from '@/constants/permissions'

interface NavItem {
  label: string
  href: string
  icon: Icon
  permission: string
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: IconGauge, permission: PERMISSIONS.DASHBOARD },
  { label: 'Monthly Subscription', href: '/monthly-subscription', icon: IconCalendar, permission: PERMISSIONS.MONTHLY_SUBSCRIPTION },
  { label: "Today's Token", href: '/todays-token', icon: IconTicket, permission: PERMISSIONS.TODAYS_TOKEN },
  { label: 'Month Configuration', href: '/admin/month-configuration', icon: IconCalendarStats, permission: PERMISSIONS.MONTH_CONFIGURATION },
  { label: 'Scan Token', href: '/admin/scan-token', icon: IconScan, permission: PERMISSIONS.SCAN_TOKEN },
  { label: 'Reports', href: '/admin/reports', icon: IconChartBar, permission: PERMISSIONS.REPORTS },
]

export function AppSidebar() {
  const location = useLocation()
  const user = useAppSelector((state) => state.auth.user)
  const permissions = user?.permissions ?? []

  const visibleItems = NAV_ITEMS.filter((item) => permissions.includes(item.permission))

  return (
    <AppShell.Navbar p="md" style={{ borderRight: '1px solid var(--mantine-color-gray-2)' }}>
      <Stack gap={4}>
        {visibleItems.map((item) => {
          const isActive =
            location.pathname === item.href ||
            location.pathname.startsWith(item.href + '/')
          const Icon = item.icon

          return (
            <UnstyledButton
              key={item.href}
              component={Link}
              to={item.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '10px 14px',
                borderRadius: 8,
                textDecoration: 'none',
                background: isActive
                  ? 'linear-gradient(135deg, #059669, #10b981)'
                  : 'transparent',
                color: isActive ? 'white' : 'var(--mantine-color-gray-7)',
                fontWeight: isActive ? 600 : 400,
                transition: 'background 150ms ease, color 150ms ease',
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  ;(e.currentTarget as HTMLButtonElement).style.background =
                    'var(--mantine-color-gray-0)'
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  ;(e.currentTarget as HTMLButtonElement).style.background = 'transparent'
                }
              }}
            >
              <Box style={{ display: 'flex', flexShrink: 0 }}>
                <Icon size={20} stroke={1.8} />
              </Box>
              <Text size="sm" style={{ color: 'inherit', fontWeight: 'inherit' }}>
                {item.label}
              </Text>
            </UnstyledButton>
          )
        })}
      </Stack>
    </AppShell.Navbar>
  )
}
