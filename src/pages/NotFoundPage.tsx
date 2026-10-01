import { Button, Center, Stack, Text, Title } from '@mantine/core'
import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <Center mih="100vh">
      <Stack align="center" gap="md">
        <Text fz={56} lh={1}>🔍</Text>
        <Title order={2}>Page Not Found</Title>
        <Text c="dimmed" ta="center" maw={320}>
          The page you&apos;re looking for doesn&apos;t exist.
        </Text>
        <Button component={Link} to="/dashboard" variant="subtle" color="teal">
          Back to Dashboard
        </Button>
      </Stack>
    </Center>
  )
}
