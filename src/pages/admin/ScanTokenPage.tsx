import { Stack, Text, Title } from '@mantine/core'

export default function ScanTokenPage() {
  return (
    <Stack gap="xs">
      <Title order={2}>Scan Token</Title>
      <Text c="dimmed">Use camera to scan or validate manually</Text>
    </Stack>
  )
}
