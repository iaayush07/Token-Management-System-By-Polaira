import { Stack, Text, Title } from '@mantine/core'

export default function MonthlySubscriptionPage() {
  return (
    <Stack gap="xs">
      <Title order={2}>Monthly Subscription 📅</Title>
      <Text c="dimmed">
        Subscribe for lunch access in{' '}
        {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}
      </Text>
    </Stack>
  )
}
