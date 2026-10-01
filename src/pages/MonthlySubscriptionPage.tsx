import { useEffect, useState } from 'react'
import {
  Box,
  Button,
  Card,
  Divider,
  Grid,
  Group,
  Loader,
  Stack,
  Text,
  Title,
} from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { IconCheck, IconX } from '@tabler/icons-react'
import { useAppSelector } from '@/store/hooks'
import { getEnrollmentStatus } from '@/services/enrollmentService'
import { saveSubscription } from '@/services/subscriptionService'

type Choice = 'YES' | 'NO'

export default function MonthlySubscriptionPage() {
  const user = useAppSelector((state) => state.auth.user)
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth() + 1
  const monthName = now.toLocaleString('default', { month: 'long' })

  const [isEnrollmentLoading, setIsEnrollmentLoading] = useState(true)
  const [isEnrollmentOpen, setIsEnrollmentOpen] = useState(false)
  const [choice, setChoice] = useState<Choice>('YES')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    async function load() {
      try {
        const status = await getEnrollmentStatus(year, month)
        setIsEnrollmentOpen(status.isOpen)
      } catch {
        setIsEnrollmentOpen(false)
      } finally {
        setIsEnrollmentLoading(false)
      }
    }
    load()
  }, [year, month])

  async function handleSubmit() {
    if (!user) return
    const startDate = new Date(year, month - 1, 1).toISOString().split('T')[0]
    setIsSubmitting(true)
    try {
      await saveSubscription({
        userId: user.id,
        planName: 'LUNCH',
        status: choice === 'YES' ? 'ACTIVE' : 'INACTIVE',
        startDate,
      })
      notifications.show({
        title: 'Subscription saved',
        message: 'Your subscription choice has been saved successfully.',
        color: 'teal',
      })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Something went wrong.'
      notifications.show({ title: 'Submission failed', message, color: 'red' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const isSubmitDisabled = !isEnrollmentOpen || isSubmitting || isEnrollmentLoading || !user

  return (
    <Stack gap="xl">
      <Stack gap="xs">
        <Title order={2}>Monthly Subscription 📅</Title>
        <Text c="dimmed">
          Subscribe for lunch access in {monthName} {year}
        </Text>
      </Stack>

      <Grid gutter="xl">
        {/* Left: Subscription Form */}
        <Grid.Col span={{ base: 12, md: 7 }}>
          <Card shadow="sm" p="xl" radius="md" withBorder>
            <Stack gap="lg">
              {isEnrollmentLoading ? (
                <Group gap="xs">
                  <Loader size="xs" />
                  <Text size="sm" c="dimmed">Checking enrollment status…</Text>
                </Group>
              ) : isEnrollmentOpen ? (
                <Text size="sm" fw={500}>🟢 Enrollment is currently open</Text>
              ) : (
                <Text size="sm" fw={500}>🔴 Enrollment is closed for the target month</Text>
              )}

              <Divider />

              <Text fw={500}>
                Do you want to subscribe for lunch in {monthName} {year}?
              </Text>

              {/* Yes card */}
              <Box
                onClick={() => setChoice('YES')}
                style={{
                  padding: '16px 20px',
                  borderRadius: 8,
                  cursor: 'pointer',
                  border: choice === 'YES' ? '2px solid transparent' : '2px solid var(--mantine-color-gray-3)',
                  background: choice === 'YES' ? 'linear-gradient(135deg, #059669, #10b981)' : 'white',
                  transition: 'all 150ms ease',
                }}
              >
                <Group gap="sm">
                  <IconCheck size={18} color={choice === 'YES' ? 'white' : 'var(--mantine-color-gray-7)'} />
                  <Box>
                    <Text fw={600} size="sm" c={choice === 'YES' ? 'white' : undefined}>
                      Yes, I want
                    </Text>
                    <Text
                      size="xs"
                      style={{
                        color: choice === 'YES' ? 'rgba(255,255,255,0.8)' : 'var(--mantine-color-dimmed)',
                      }}
                    >
                      Subscribe for daily lunch access
                    </Text>
                  </Box>
                </Group>
              </Box>

              {/* No card */}
              <Box
                onClick={() => setChoice('NO')}
                style={{
                  padding: '16px 20px',
                  borderRadius: 8,
                  cursor: 'pointer',
                  border: choice === 'NO' ? '2px solid #059669' : '2px solid var(--mantine-color-gray-3)',
                  background: 'white',
                  transition: 'all 150ms ease',
                }}
              >
                <Group gap="sm">
                  <IconX size={18} color="var(--mantine-color-gray-7)" />
                  <Box>
                    <Text fw={600} size="sm">No, I don't want</Text>
                    <Text size="xs" c="dimmed">Opt out for next Month</Text>
                  </Box>
                </Group>
              </Box>

              <Group justify="flex-end">
                <Button
                  onClick={handleSubmit}
                  loading={isSubmitting}
                  disabled={isSubmitDisabled}
                  style={
                    isSubmitDisabled
                      ? undefined
                      : { background: 'linear-gradient(135deg, #059669, #10b981)' }
                  }
                >
                  Submit Subscription
                </Button>
              </Group>
            </Stack>
          </Card>
        </Grid.Col>

        {/* Right: Status Sidebar */}
        <Grid.Col span={{ base: 12, md: 5 }}>
          <Stack gap="md">
            <Card shadow="sm" p="lg" radius="md" withBorder>
              <Stack gap="md">
                <Text fw={600}>Current Status</Text>
                <Card p="sm" radius="sm" withBorder style={{ background: 'var(--mantine-color-gray-0)' }}>
                  <Text size="xs" c="dimmed">Current Month</Text>
                  <Text size="sm" fw={500} mt={4}>
                    {choice === 'YES' ? '✅ Will Subscribe' : '❌ Will Not Subscribe'}
                  </Text>
                </Card>
                <Card p="sm" radius="sm" withBorder style={{ background: 'var(--mantine-color-gray-0)' }}>
                  <Text size="xs" c="dimmed">Enrollment Status</Text>
                  <Text size="sm" fw={500} mt={4}>
                    {isEnrollmentLoading ? '…' : isEnrollmentOpen ? '🟢 Open' : '🔴 Closed'}
                  </Text>
                </Card>
              </Stack>
            </Card>

            <Divider />

            <Card shadow="sm" p="lg" radius="md" withBorder>
              <Stack gap="sm">
                <Text fw={600}>Important Notes</Text>
                <Stack gap="xs">
                  {[
                    'Subscriptions must be submitted before the cutoff date.',
                    'Once the cutoff passes, changes cannot be made.',
                    'You can update your choice anytime before cutoff.',
                  ].map((note) => (
                    <Group key={note} gap="xs" align="flex-start">
                      <Text size="sm" c="dimmed" style={{ flexShrink: 0 }}>•</Text>
                      <Text size="sm" c="dimmed">{note}</Text>
                    </Group>
                  ))}
                </Stack>
              </Stack>
            </Card>
          </Stack>
        </Grid.Col>
      </Grid>
    </Stack>
  )
}
