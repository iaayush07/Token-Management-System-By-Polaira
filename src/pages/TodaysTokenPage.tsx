import { Stack, Text, Title } from '@mantine/core'

export default function TodaysTokenPage() {
  return (
    <Stack gap="xs">
      <Title order={2}>{"Today's Token 🎫"}</Title>
      <Text c="dimmed">{new Date().toLocaleDateString('default', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</Text>
    </Stack>
  )
}
