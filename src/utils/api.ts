const API_BASE = '/api'

export function isTokenExpired(token: string): boolean {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return true
    const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'))) as unknown
    if (typeof payload !== 'object' || payload === null || !('exp' in payload)) return true
    return typeof (payload as { exp: unknown }).exp !== 'number' || ((payload as { exp: number }).exp * 1000) < Date.now()
  } catch {
    return true
  }
}

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('tms_token')

  if (token && isTokenExpired(token)) {
    throw new ApiError('Your session has expired. Please log in again.', 401)
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers })

  let body: unknown
  try {
    body = await res.json()
  } catch {
    body = {}
  }

  if (!res.ok) {
    const message =
      typeof body === 'object' &&
      body !== null &&
      'message' in body &&
      typeof (body as Record<string, unknown>).message === 'string'
        ? (body as { message: string }).message
        : `Request failed (${res.status})`
    throw new ApiError(message, res.status)
  }

  return body as T
}

export const api = {
  get<T>(path: string): Promise<T> {
    return request<T>(path, { method: 'GET' })
  },

  post<T>(path: string, data: unknown): Promise<T> {
    return request<T>(path, { method: 'POST', body: JSON.stringify(data) })
  },

  put<T>(path: string, data: unknown): Promise<T> {
    return request<T>(path, { method: 'PUT', body: JSON.stringify(data) })
  },

  patch<T>(path: string, data: unknown): Promise<T> {
    return request<T>(path, { method: 'PATCH', body: JSON.stringify(data) })
  },

  delete<T>(path: string): Promise<T> {
    return request<T>(path, { method: 'DELETE' })
  },
}
