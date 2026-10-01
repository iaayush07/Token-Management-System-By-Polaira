import type { FC, SVGProps } from 'react'

type TablerIconProps = SVGProps<SVGSVGElement> & {
  size?: number | string
  stroke?: number | string
  color?: string
  className?: string
}

declare module '@tabler/icons-react' {
  export type Icon = FC<TablerIconProps>
  export const IconGauge: Icon
  export const IconCalendar: Icon
  export const IconCalendarStats: Icon
  export const IconTicket: Icon
  export const IconScan: Icon
  export const IconChartBar: Icon
  export const IconQrcode: Icon
  export const IconClock: Icon
  export const IconX: Icon
  export const IconCheck: Icon
  export const IconAlertCircle: Icon
  export const IconCamera: Icon
  export const IconLoader: Icon
}
