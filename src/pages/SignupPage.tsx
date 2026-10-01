import { useState } from 'react'
import type { FormEvent } from 'react'
import {
  Anchor,
  Box,
  Button,
  Card,
  Center,
  PasswordInput,
  Select,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { Link, useNavigate } from 'react-router-dom'
import { signup } from '@/services/authService'
import type { UserRole } from '@/types'

interface FormValues {
  fullName: string
  email: string
  password: string
  role: UserRole
}

interface FormErrors {
  fullName?: string
  email?: string
  password?: string
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {}

  if (values.fullName.trim().length < 2) {
    errors.fullName = 'Full name must be at least 2 characters'
  }

  if (!EMAIL_RE.test(values.email)) {
    errors.email = 'Please enter a valid email address'
  }

  if (values.password.length < 8) {
    errors.password = 'Password must be at least 8 characters'
  }

  return errors
}

export default function SignupPage() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [values, setValues] = useState<FormValues>({
    fullName: '',
    email: '',
    password: '',
    role: 'EMPLOYEE',
  })
  const [errors, setErrors] = useState<FormErrors>({})

  function handleText(field: keyof FormErrors, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  function handleRole(value: string | null) {
    setValues((prev) => ({ ...prev, role: (value ?? 'EMPLOYEE') as UserRole }))
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const validationErrors = validate(values)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setIsLoading(true)
    try {
      await signup(values)
      notifications.show({
        title: 'Account created',
        message: 'Your account has been created successfully.',
        color: 'teal',
      })
      navigate('/login')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Something went wrong. Please try again.'
      notifications.show({
        title: 'Signup error',
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
          <Text fz={36} lh={1}>
            🍽️
          </Text>
          <Title order={2} fw={700}>
            Create your account
          </Title>
          <Text c="dimmed" size="sm">
            Token Management — Lunch Access System
          </Text>
        </Stack>

        <Card shadow="sm" p="xl" radius="md" withBorder>
          <form onSubmit={handleSubmit} noValidate>
            <Stack gap="md">
              <TextInput
                label="Full Name"
                placeholder="Jane Doe"
                required
                value={values.fullName}
                onChange={(e) => handleText('fullName', e.currentTarget.value)}
                error={errors.fullName}
                disabled={isLoading}
              />
              <TextInput
                label="Email"
                placeholder="you@example.com"
                type="email"
                required
                value={values.email}
                onChange={(e) => handleText('email', e.currentTarget.value)}
                error={errors.email}
                disabled={isLoading}
              />
              <PasswordInput
                label="Password"
                placeholder="Min. 8 characters"
                required
                value={values.password}
                onChange={(e) => handleText('password', e.currentTarget.value)}
                error={errors.password}
                disabled={isLoading}
              />
              <Select
                label="Role"
                value={values.role}
                onChange={handleRole}
                data={[
                  { value: 'EMPLOYEE', label: 'Employee' },
                  { value: 'ADMIN', label: 'Admin' },
                ]}
                disabled={isLoading}
                allowDeselect={false}
              />
              <Button
                type="submit"
                fullWidth
                mt="sm"
                loading={isLoading}
                style={{ background: 'linear-gradient(135deg, #059669, #10b981)' }}
              >
                Create Account
              </Button>
            </Stack>
          </form>
        </Card>

        <Text ta="center" mt="md" size="sm" c="dimmed">
          Already have an account?{' '}
          <Anchor component={Link} to="/login" fw={500} c="teal">
            Sign in
          </Anchor>
        </Text>
      </Box>
    </Center>
  )
}
