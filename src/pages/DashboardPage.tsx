import { Stack, Text, Title } from '@mantine/core'
import { useAppSelector } from '@/store/hooks'

export default function DashboardPage() {
  const user = useAppSelector((state) => state.auth.user)

  return (
    <Stack gap="xs">
      <Title order={2}>Welcome, {user?.fullName ?? 'User'}! 👋</Title>
      <Text c="dimmed">Manage your lunch subscription and daily tokens</Text>
    </Stack>
  )
}
