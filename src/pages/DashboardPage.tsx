import { Badge, Box, Button, Card, Grid, Group, Stack, Text, Title } from '@mantine/core'
import { IconCalendar, IconClock } from '@tabler/icons-react'
import { Link } from 'react-router-dom'
import { useAppSelector } from '@/store/hooks'

export default function DashboardPage() {
  const user = useAppSelector((state) => state.auth.user)

  return (
    <Stack gap="xl">
      <Stack gap="xs">
        <Title order={2}>Welcome, {user?.fullName ?? 'User'}! 👋</Title>
        <Text c="dimmed">Manage your lunch subscription and daily tokens</Text>
      </Stack>

      <Grid gutter="lg">
        <Grid.Col span={{ base: 12, sm: 6 }}>
          <Card shadow="sm" p="xl" radius="md" withBorder h="100%">
            <Stack gap="md">
              <Box
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 12,
                  background: 'linear-gradient(135deg, #7c3aed, #a78bfa)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <IconCalendar size={26} color="white" stroke={1.8} />
              </Box>

              <Stack gap={4}>
                <Group gap="xs">
                  <Text fw={600} fz="lg">Monthly Subscription</Text>
                  <Badge color="teal" variant="light">Subscribed</Badge>
                </Group>
                <Text c="dimmed" size="sm">Manage your lunch subscription for the current month</Text>
              </Stack>

              <Button
                component={Link}
                to="/monthly-subscription"
                variant="outline"
                color="teal"
                style={{ alignSelf: 'flex-start' }}
              >
                Manage Subscription
              </Button>
            </Stack>
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, sm: 6 }}>
          <Card shadow="sm" p="xl" radius="md" withBorder h="100%">
            <Stack gap="md">
              <Box
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 12,
                  background: 'linear-gradient(135deg, #1d4ed8, #60a5fa)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <IconClock size={26} color="white" stroke={1.8} />
              </Box>

              <Stack gap={4}>
                <Group gap="xs">
                  <Text fw={600} fz="lg">Today's Lunch</Text>
                  <Badge color="green" variant="light">Active</Badge>
                </Group>
                <Text c="dimmed" size="sm">View your daily QR token for lunch access</Text>
              </Stack>

              <Button
                component={Link}
                to="/todays-token"
                variant="outline"
                color="blue"
                style={{ alignSelf: 'flex-start' }}
              >
                Show Today's QR
              </Button>
            </Stack>
          </Card>
        </Grid.Col>
      </Grid>
    </Stack>
  )
}
