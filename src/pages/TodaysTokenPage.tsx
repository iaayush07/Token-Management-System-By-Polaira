import { useEffect, useState } from 'react'
import { Alert, Badge, Box, Card, Grid, Group, Loader, Stack, Text, Title } from '@mantine/core'
import { IconAlertCircle } from '@tabler/icons-react'
import { QRCodeSVG } from 'qrcode.react'
import { useAppSelector } from '@/store/hooks'
import { getTodayToken, generateToken } from '@/services/qrService'

type TokenDisplayStatus = 'loading' | 'valid' | 'expired' | 'unsubscribed'

export default function TodaysTokenPage() {
  const user = useAppSelector((state) => state.auth.user)
  const today = new Date()

  const [displayStatus, setDisplayStatus] = useState<TokenDisplayStatus>('loading')
  const [tokenValue, setTokenValue] = useState<string | null>(null)

  useEffect(() => {
    if (!user) return

    async function loadToken() {
      setDisplayStatus('loading')
      try {
        const result = await getTodayToken(user!.id)

        if (result.status === 'unsubscribed') {
          setDisplayStatus('unsubscribed')
          return
        }

        if (result.status === 'expired' && result.token) {
          setTokenValue(result.token)
          setDisplayStatus('expired')
          return
        }

        if (result.status === 'valid' && result.token) {
          setTokenValue(result.token)
          setDisplayStatus('valid')
          return
        }

        // status === 'none' — auto-generate
        const generated = await generateToken(user!.id)
        setTokenValue(generated.token)
        setDisplayStatus('valid')
      } catch {
        setDisplayStatus('unsubscribed')
      }
    }

    loadToken()
  }, [user])

  return (
    <Stack gap="xl">
      <Stack gap="xs">
        <Title order={2}>Today's Token 🎫</Title>
        <Text c="dimmed">
          {today.toLocaleDateString('default', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </Text>
      </Stack>

      <Grid gutter="xl">
        {/* Left: QR Display */}
        <Grid.Col span={{ base: 12, md: 7 }}>
          <Card shadow="sm" p="xl" radius="md" withBorder>
            <Stack gap="md">
              <Box>
                <Text fw={600} fz="lg">QR Token for {user?.fullName}</Text>
                <Text size="sm" c="dimmed">Show this QR code at the lunch counter</Text>
              </Box>

              {/* QR box */}
              <Box
                style={{
                  width: 260,
                  height: 260,
                  border: '2px solid var(--mantine-color-gray-3)',
                  borderRadius: 8,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto',
                  overflow: 'hidden',
                }}
              >
                {displayStatus === 'loading' && (
                  <Stack align="center" gap="xs">
                    <Loader size="md" color="teal" />
                    <Text size="sm" c="dimmed">Fetching today's token…</Text>
                  </Stack>
                )}
                {displayStatus === 'valid' && tokenValue && (
                  <QRCodeSVG value={tokenValue} size={240} />
                )}
                {displayStatus === 'expired' && tokenValue && (
                  <Stack align="center" gap="xs">
                    <QRCodeSVG value={tokenValue} size={200} style={{ opacity: 0.3 }} />
                  </Stack>
                )}
                {displayStatus === 'expired' && !tokenValue && (
                  <Text c="orange" fw={600} ta="center">Token expired</Text>
                )}
                {displayStatus === 'unsubscribed' && (
                  <Text c="red" fw={500} ta="center" px="md" size="sm">
                    Please subscribe for this month to get a token
                  </Text>
                )}
              </Box>

              {/* Status badge */}
              {(displayStatus === 'valid' || displayStatus === 'expired') && (
                <Group justify="center">
                  <Badge
                    color={displayStatus === 'valid' ? 'green' : 'orange'}
                    variant="filled"
                    size="lg"
                  >
                    {displayStatus === 'valid' ? 'Active' : 'Expired'}
                  </Badge>
                </Group>
              )}

              <Alert icon={<IconAlertCircle size={16} />} color="yellow" variant="light">
                <Stack gap={4}>
                  <Text size="sm" fw={500}>This QR code is valid until 8:00 PM today.</Text>
                  <Text size="sm">Each token can only be used once.</Text>
                  <Text size="sm">Please present this to the admin at the lunch counter.</Text>
                </Stack>
              </Alert>
            </Stack>
          </Card>
        </Grid.Col>

        {/* Right: How to Use */}
        <Grid.Col span={{ base: 12, md: 5 }}>
          <Card shadow="sm" p="xl" radius="md" withBorder>
            <Stack gap="md">
              <Text fw={600} fz="lg">How to Use</Text>
              <Stack gap="md">
                {[
                  'Visit the lunch counter between 12:00 PM – 2:00 PM.',
                  'Show this QR code to the admin.',
                  'Wait for validation confirmation.',
                  'Enjoy your meal! 🍽️',
                ].map((step, i) => (
                  <Group key={i} gap="md" align="flex-start" wrap="nowrap">
                    <Box
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #059669, #10b981)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <Text size="xs" fw={700} c="white">{i + 1}</Text>
                    </Box>
                    <Text size="sm" style={{ paddingTop: 4 }}>{step}</Text>
                  </Group>
                ))}
              </Stack>
            </Stack>
          </Card>
        </Grid.Col>
      </Grid>
    </Stack>
  )
}
