import AdminSidebar from '@/components/admin/admin-sidebar'

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AdminSidebar>
      {children}
    </AdminSidebar>
  )
}