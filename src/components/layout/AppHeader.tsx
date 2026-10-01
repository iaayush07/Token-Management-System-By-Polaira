import { AppShell, Avatar, Box, Button, Group, Text } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { logout } from '@/store/slices/authSlice'

function getInitials(fullName: string): string {
  return fullName
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase()
}

export function AppHeader() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const user = useAppSelector((state) => state.auth.user)

  function handleLogout() {
    dispatch(logout())
    notifications.show({
      message: 'Logged out successfully',
      color: 'gray',
    })
    navigate('/login', { replace: true })
  }

  return (
    <AppShell.Header
      style={{
        borderBottom: '1px solid var(--mantine-color-gray-2)',
        background: 'white',
      }}
    >
      <Group h="100%" px="lg" justify="space-between">
        <Group gap="xs">
          <Text fz={24} lh={1}>
            🍽️
          </Text>
          <Box>
            <Text fw={700} fz="sm" lh={1.2} style={{ color: 'var(--mantine-color-gray-8)' }}>
              Token Management
            </Text>
            <Text fz="xs" c="dimmed" lh={1.2}>
              Lunch Access System
            </Text>
          </Box>
        </Group>

        <Group gap="sm">
          {user && (
            <Avatar
              size={34}
              radius="xl"
              style={{
                background: 'linear-gradient(135deg, #059669, #10b981)',
                color: 'white',
                fontWeight: 600,
                fontSize: 13,
              }}
            >
              {getInitials(user.fullName)}
            </Avatar>
          )}
          <Button
            variant="subtle"
            color="gray"
            size="sm"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Group>
      </Group>
    </AppShell.Header>
  )
}
