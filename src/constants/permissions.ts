export const PERMISSIONS = {
  DASHBOARD: 'dashboard',
  MONTHLY_SUBSCRIPTION: 'monthly_subscription',
  TODAYS_TOKEN: 'todays_token',
  MONTH_CONFIGURATION: 'month_configuration',
  SCAN_TOKEN: 'scan_token',
  REPORTS: 'reports',
} as const

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS]
