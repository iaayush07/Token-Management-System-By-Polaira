import { Anchor, Box, Button, Card, Center, PasswordInput, Stack, Text, TextInput, Title } from '@mantine/core'
import { Link } from 'react-router-dom'

export default function LoginPage() {
  return (
    <Center mih="100vh" style={{ background: 'var(--mantine-color-gray-0)' }}>
      <Box w="100%" maw={420} px="md">
        <Stack gap="xs" mb="xl" ta="center">
          <Text fz={36} lh={1}>🍽️</Text>
          <Title order={2} fw={700}>Sign in to your account</Title>
          <Text c="dimmed" size="sm">Token Management — Lunch Access System</Text>
        </Stack>

        <Card shadow="sm" p="xl" radius="md" withBorder>
          <Stack gap="md">
            <TextInput label="Email" placeholder="you@example.com" type="email" required />
            <PasswordInput label="Password" placeholder="Your password" required />
            <Button
              fullWidth
              mt="sm"
              style={{ background: 'linear-gradient(135deg, #059669, #10b981)' }}
            >
              Sign In
            </Button>
          </Stack>
        </Card>

        <Text ta="center" mt="md" size="sm" c="dimmed">
          Don&apos;t have an account?{' '}
          <Anchor component={Link} to="/signup" fw={500} c="teal">
            Create one
          </Anchor>
        </Text>
      </Box>
    </Center>
  )
}
