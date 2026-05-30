interface DashboardHeaderProps {
  profile: {
    id: string
    nickname?: string
    display_name?: string
    membership_status?: string
    email?: string
    is_admin?: boolean
  } | null
  initialUnreadCount?: number
}

export function DashboardHeader(_props: DashboardHeaderProps) {
  return null
}

export default DashboardHeader
