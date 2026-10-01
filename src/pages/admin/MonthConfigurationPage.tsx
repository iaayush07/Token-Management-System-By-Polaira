import { Stack, Text, Title } from '@mantine/core'

export default function MonthConfigurationPage() {
  return (
    <Stack gap="xs">
      <Title order={2}>Month Configuration</Title>
      <Text c="dimmed">Manage monthly enrollment and subscriptions</Text>
    </Stack>
  )
}
