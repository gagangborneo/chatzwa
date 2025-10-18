'use client'

import DashboardSidebar from '@/components/dashboard/sidebar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Remove double authentication check - middleware already handles this
  // This eliminates unnecessary API calls and speeds up navigation

  return (
    <DashboardSidebar>
      {children}
    </DashboardSidebar>
  )
}