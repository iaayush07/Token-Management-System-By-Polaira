import { useEffect, useRef, useState } from 'react'
import { Box, Button, Card, Grid, Group, Stack, Text, TextInput, Title } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { IconCamera, IconCameraOff } from '@tabler/icons-react'
import jsQR from 'jsqr'
import { scanToken } from '@/services/qrService'

type ScanState = 'idle' | 'scanning' | 'validating' | 'done'

interface ScanResult {
  success: boolean
  message: string
}

export default function ScanTokenPage() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const rafRef = useRef<number>(0)

  const [scanState, setScanState] = useState<ScanState>('idle')
  const [scannedToken, setScannedToken] = useState('')
  const [scanResult, setScanResult] = useState<ScanResult | null>(null)
  const [manualToken, setManualToken] = useState('')
  const [isManualValidating, setIsManualValidating] = useState(false)

  useEffect(() => {
    return () => {
      cancelAnimationFrame(rafRef.current)
      streamRef.current?.getTracks().forEach((t) => t.stop())
    }
  }, [])

  async function startCamera() {
    setScanState('scanning')
    setScanResult(null)
    setScannedToken('')
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' } },
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
      }
      startScanLoop()
    } catch {
      setScanState('idle')
      notifications.show({ message: 'Camera access denied or unavailable.', color: 'red' })
    }
  }

  function stopCamera() {
    cancelAnimationFrame(rafRef.current)
    streamRef.current?.getTracks().forEach((t) => t.stop())
    streamRef.current = null
    if (videoRef.current) videoRef.current.srcObject = null
    setScanState('idle')
  }

  function startScanLoop() {
    const tick = () => {
      const video = videoRef.current
      const canvas = canvasRef.current
      if (!video || !canvas || video.readyState < HTMLMediaElement.HAVE_ENOUGH_DATA) {
        rafRef.current = requestAnimationFrame(tick)
        return
      }
      const ctx = canvas.getContext('2d')
      if (!ctx) return
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const code = jsQR(imageData.data, imageData.width, imageData.height)
      if (code) {
        stopCamera()
        setScannedToken(code.data)
        runValidation(code.data)
        return
      }
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
  }

  async function runValidation(token: string) {
    setScanState('validating')
    try {
      const result = await scanToken(token)
      setScanResult({ success: true, message: `${result.message} (User: ${result.userId})` })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Validation failed.'
      setScanResult({ success: false, message })
    } finally {
      setScanState('done')
    }
  }

  async function handleManualValidate() {
    if (!manualToken.trim()) return
    setIsManualValidating(true)
    try {
      const result = await scanToken(manualToken.trim())
      notifications.show({
        title: 'Token validated',
        message: `${result.message} (User: ${result.userId})`,
        color: 'teal',
      })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Validation failed.'
      notifications.show({ title: 'Validation failed', message, color: 'red' })
    } finally {
      setIsManualValidating(false)
    }
  }

  const cameraActive = scanState === 'scanning'

  return (
    <Stack gap="xl">
      <Stack gap="xs">
        <Title order={2}>Scan Token</Title>
        <Text c="dimmed">Use camera to scan or validate manually</Text>
      </Stack>

      <Grid gutter="xl">
        {/* Left: Scan cards */}
        <Grid.Col span={{ base: 12, md: 7 }}>
          <Stack gap="md">
            {/* Camera Scan Card */}
            <Card shadow="sm" p="xl" radius="md" withBorder>
              <Stack gap="md" align="center">
                {!cameraActive && scanState !== 'validating' && (
                  <>
                    <Box
                      style={{
                        width: 72,
                        height: 72,
                        borderRadius: 16,
                        background: 'linear-gradient(135deg, #1d4ed8, #60a5fa)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <IconCamera size={36} color="white" stroke={1.5} />
                    </Box>
                    <Text fw={600} fz="lg">Ready to Scan</Text>
                    <Text size="sm" c="dimmed" ta="center">Click the button below to start scanning</Text>
                    <Button
                      onClick={startCamera}
                      leftSection={<IconCamera size={16} />}
                      style={{ background: 'linear-gradient(135deg, #059669, #10b981)' }}
                    >
                      Start Camera
                    </Button>
                  </>
                )}

                {cameraActive && (
                  <Stack gap="sm" style={{ width: '100%' }}>
                    <video
                      ref={videoRef}
                      muted
                      playsInline
                      style={{ width: '100%', borderRadius: 8 }}
                    />
                    <Group justify="space-between" align="center">
                      <Text size="sm" c="dimmed">Scanning…</Text>
                      <Button
                        size="sm"
                        variant="outline"
                        color="red"
                        leftSection={<IconCameraOff size={14} />}
                        onClick={stopCamera}
                      >
                        Stop Camera
                      </Button>
                    </Group>
                  </Stack>
                )}

                {scanState === 'validating' && (
                  <Text size="sm" c="dimmed">Validating…</Text>
                )}

                <canvas ref={canvasRef} style={{ display: 'none' }} />

                {scannedToken && (scanState === 'done' || scanState === 'validating') && (
                  <Stack gap="sm" style={{ width: '100%' }}>
                    <TextInput
                      label="Scanned Token"
                      value={scannedToken}
                      readOnly
                      styles={{ input: { fontFamily: 'monospace', fontSize: 12 } }}
                    />
                    {scanResult && (
                      <Text size="sm" fw={500} c={scanResult.success ? 'teal' : 'red'}>
                        {scanResult.message}
                      </Text>
                    )}
                    <Group justify="flex-end">
                      <Button
                        size="sm"
                        onClick={() => runValidation(scannedToken)}
                        disabled={scanState === 'validating'}
                        loading={scanState === 'validating'}
                        style={
                          scanState !== 'validating'
                            ? { background: 'linear-gradient(135deg, #059669, #10b981)' }
                            : undefined
                        }
                      >
                        Validate
                      </Button>
                    </Group>
                  </Stack>
                )}
              </Stack>
            </Card>

            {/* Manual Validation Card */}
            <Card shadow="sm" p="xl" radius="md" withBorder>
              <Stack gap="md">
                <Box>
                  <Text fw={600} fz="lg">Manual Validation</Text>
                  <Text size="sm" c="dimmed">Enter token data manually if camera is unavailable</Text>
                </Box>
                <Group gap="sm" align="flex-end">
                  <TextInput
                    placeholder="Enter token"
                    value={manualToken}
                    onChange={(e) => setManualToken(e.currentTarget.value)}
                    disabled={isManualValidating}
                    styles={{ input: { fontFamily: 'monospace' }, root: { flex: 1 } }}
                  />
                  <Button
                    onClick={handleManualValidate}
                    disabled={!manualToken.trim() || isManualValidating}
                    loading={isManualValidating}
                    style={
                      !manualToken.trim() || isManualValidating
                        ? undefined
                        : { background: 'linear-gradient(135deg, #059669, #10b981)' }
                    }
                  >
                    Validate
                  </Button>
                </Group>
              </Stack>
            </Card>
          </Stack>
        </Grid.Col>

        {/* Right: Instructions */}
        <Grid.Col span={{ base: 12, md: 5 }}>
          <Card shadow="sm" p="xl" radius="md" withBorder>
            <Stack gap="md">
              <Text fw={600} fz="lg">Validation Instructions</Text>
              <Stack gap="md">
                {[
                  'Click "Start Camera" to begin scanning.',
                  'Ask employee to show their QR token.',
                  'Position the QR code within the camera frame.',
                  'System will automatically validate and show results.',
                  'Each token can only be used once per day.',
                ].map((step, i) => (
                  <Group key={i} gap="md" align="flex-start" wrap="nowrap">
                    <Box
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #1d4ed8, #60a5fa)',
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
