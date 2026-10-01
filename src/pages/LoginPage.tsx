import { useState } from 'react'
import type { FormEvent } from 'react'
import { Anchor, Box, Button, Card, Center, PasswordInput, Stack, Text, TextInput, Title } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { Link, useNavigate } from 'react-router-dom'
import { login, getMe } from '@/services/authService'
import { setCredentials } from '@/store/slices/authSlice'
import { useAppDispatch } from '@/store/hooks'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

interface FormErrors {
  email?: string
  password?: string
}

export default function LoginPage() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<FormErrors>({})

  function validate(): FormErrors {
    const errs: FormErrors = {}
    if (!EMAIL_RE.test(email)) errs.email = 'Please enter a valid email address'
    if (password.length < 8) errs.password = 'Password must be at least 8 characters'
    return errs
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }

    setIsLoading(true)
    try {
      const { token } = await login({ email, password })
      localStorage.setItem('tms_token', token)
      const user = await getMe()
      dispatch(setCredentials({ user, token }))
      notifications.show({
        title: 'Welcome back',
        message: `Good to see you, ${user.fullName}!`,
        color: 'teal',
      })
      navigate('/dashboard')
    } catch (err) {
      localStorage.removeItem('tms_token')
      const message = err instanceof Error ? err.message : 'Something went wrong. Please try again.'
      notifications.show({
        title: 'Login failed',
        message,
        color: 'red',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Center mih="100vh" style={{ background: 'var(--mantine-color-gray-0)' }}>
      <Box w="100%" maw={420} px="md">
        <Stack gap="xs" mb="xl" ta="center">
          <Text fz={36} lh={1}>🍽️</Text>
          <Title order={2} fw={700}>Sign in to your account</Title>
          <Text c="dimmed" size="sm">Token Management — Lunch Access System</Text>
        </Stack>

        <Card shadow="sm" p="xl" radius="md" withBorder>
          <form onSubmit={handleSubmit} noValidate>
            <Stack gap="md">
              <TextInput
                label="Email"
                placeholder="you@example.com"
                type="email"
                required
                value={email}
                onChange={(e) => { setEmail(e.currentTarget.value); setErrors((prev) => ({ ...prev, email: undefined })) }}
                error={errors.email}
                disabled={isLoading}
              />
              <PasswordInput
                label="Password"
                placeholder="Your password"
                required
                value={password}
                onChange={(e) => { setPassword(e.currentTarget.value); setErrors((prev) => ({ ...prev, password: undefined })) }}
                error={errors.password}
                disabled={isLoading}
              />
              <Button
                type="submit"
                fullWidth
                mt="sm"
                loading={isLoading}
                style={{ background: 'linear-gradient(135deg, #059669, #10b981)' }}
              >
                Sign In
              </Button>
            </Stack>
          </form>
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
