import { api } from '@/utils/api'

export interface EnrollmentStatus {
  isOpen: boolean
  year: number
  month: number
}

export function getEnrollmentStatus(year: number, month: number): Promise<EnrollmentStatus> {
  return api.get<EnrollmentStatus>(`/enrollment?year=${year}&month=${month}`)
}

export function toggleEnrollment(year: number, month: number): Promise<EnrollmentStatus> {
  return api.post<EnrollmentStatus>('/enrollment/toggle', { year, month })
}
