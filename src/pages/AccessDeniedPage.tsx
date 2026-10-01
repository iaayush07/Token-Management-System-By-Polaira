import { Button, Center, Stack, Text, Title } from '@mantine/core'
import { Link } from 'react-router-dom'

export default function AccessDeniedPage() {
  return (
    <Center mih="100vh">
      <Stack align="center" gap="md">
        <Text fz={56} lh={1}>🚫</Text>
        <Title order={2}>Access Denied</Title>
        <Text c="dimmed" ta="center" maw={320}>
          You don&apos;t have permission to view this page.
        </Text>
        <Button component={Link} to="/dashboard" variant="subtle" color="teal">
          Back to Dashboard
        </Button>
      </Stack>
    </Center>
  )
}
