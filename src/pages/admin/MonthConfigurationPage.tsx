import { useEffect, useState } from 'react'
import {
  Badge,
  Box,
  Card,
  Divider,
  Grid,
  Group,
  Loader,
  Stack,
  Switch,
  Table,
  Text,
  Title,
} from '@mantine/core'
import { IconCalendar } from '@tabler/icons-react'
import { notifications } from '@mantine/notifications'
import { getEnrollmentStatus, toggleEnrollment } from '@/services/enrollmentService'
import { getSubscriptions } from '@/services/subscriptionService'
import type { Subscription } from '@/services/subscriptionService'

export default function MonthConfigurationPage() {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth() + 1
  const monthName = now.toLocaleString('default', { month: 'long' })
  const monthKey = `${year}-${String(month).padStart(2, '0')}`

  const [isEnrollmentLoading, setIsEnrollmentLoading] = useState(true)
  const [isEnrollmentOpen, setIsEnrollmentOpen] = useState(false)
  const [isToggling, setIsToggling] = useState(false)
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [isSubsLoading, setIsSubsLoading] = useState(true)

  useEffect(() => {
    async function loadEnrollment() {
      try {
        const status = await getEnrollmentStatus(year, month)
        setIsEnrollmentOpen(status.isOpen)
      } finally {
        setIsEnrollmentLoading(false)
      }
    }

    async function loadSubscriptions() {
      try {
        const subs = await getSubscriptions(monthKey)
        setSubscriptions(subs)
      } finally {
        setIsSubsLoading(false)
      }
    }

    loadEnrollment()
    loadSubscriptions()
  }, [year, month, monthKey])

  async function handleToggle() {
    setIsToggling(true)
    try {
      const updated = await toggleEnrollment(year, month)
      setIsEnrollmentOpen(updated.isOpen)
      notifications.show({
        message: `Enrollment ${updated.isOpen ? 'opened' : 'closed'} successfully.`,
        color: 'teal',
      })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to toggle enrollment.'
      notifications.show({ message, color: 'red' })
    } finally {
      setIsToggling(false)
    }
  }

  const subscribedCount = subscriptions.filter((s) => s.status === 'ACTIVE').length
  const notSubscribedCount = subscriptions.filter((s) => s.status === 'INACTIVE').length

  return (
    <Stack gap="xl">
      <Stack gap="xs">
        <Title order={2}>Month Configuration</Title>
        <Text c="dimmed">Manage monthly enrollment and subscriptions</Text>
      </Stack>

      <Grid gutter="xl">
        {/* Left: Enrollment Control */}
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Card shadow="sm" p="xl" radius="md" withBorder>
            <Stack gap="md">
              <Group gap="xs">
                <IconCalendar size={18} color="var(--mantine-color-teal-6)" />
                <Text size="sm" c="dimmed" fw={500}>Current Month</Text>
              </Group>
              <Text fw={700} fz="xl">
                {monthName} {year}
              </Text>

              <Divider />

              <Group justify="space-between" align="center">
                <Text fw={500}>Enrollment Status</Text>
                {isEnrollmentLoading ? (
                  <Loader size="xs" />
                ) : (
                  <Switch
                    checked={isEnrollmentOpen}
                    onChange={handleToggle}
                    disabled={isToggling}
                    label={isEnrollmentOpen ? 'Open' : 'Closed'}
                    color="teal"
                  />
                )}
              </Group>

              <Divider />

              <Stack gap="sm">
                <Group justify="space-between">
                  <Text size="sm" c="dimmed">Subscribed</Text>
                  <Badge color="teal" variant="light">{subscribedCount}</Badge>
                </Group>
                <Group justify="space-between">
                  <Text size="sm" c="dimmed">Not Subscribed</Text>
                  <Badge color="gray" variant="light">{notSubscribedCount}</Badge>
                </Group>
              </Stack>

              <Divider />

              <Group justify="space-between">
                <Text size="sm" fw={500}>Total Employees</Text>
                <Text fw={700}>{subscriptions.length}</Text>
              </Group>
            </Stack>
          </Card>
        </Grid.Col>

        {/* Right: Employee Subscription List */}
        <Grid.Col span={{ base: 12, md: 8 }}>
          <Card shadow="sm" p="xl" radius="md" withBorder>
            <Stack gap="md">
              <Box>
                <Text fw={600} fz="lg">Employee Subscription List</Text>
                <Text size="sm" c="dimmed">View and monitor employee subscription status</Text>
              </Box>

              {isSubsLoading ? (
                <Group justify="center" py="xl">
                  <Loader color="teal" />
                </Group>
              ) : (
                <Table striped highlightOnHover withTableBorder withColumnBorders>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>Name</Table.Th>
                      <Table.Th>Email</Table.Th>
                      <Table.Th>Status</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {subscriptions.length === 0 ? (
                      <Table.Tr>
                        <Table.Td colSpan={3}>
                          <Text c="dimmed" ta="center" py="md">No subscriptions found for this month</Text>
                        </Table.Td>
                      </Table.Tr>
                    ) : (
                      subscriptions.map((sub) => (
                        <Table.Tr key={sub.id}>
                          <Table.Td>{sub.user.fullName}</Table.Td>
                          <Table.Td>{sub.user.email}</Table.Td>
                          <Table.Td>
                            <Badge
                              color={sub.status === 'ACTIVE' ? 'teal' : 'gray'}
                              variant="light"
                            >
                              {sub.status === 'ACTIVE' ? 'Subscribed' : 'Not Subscribed'}
                            </Badge>
                          </Table.Td>
                        </Table.Tr>
                      ))
                    )}
                  </Table.Tbody>
                </Table>
              )}
            </Stack>
          </Card>
        </Grid.Col>
      </Grid>
    </Stack>
  )
}
