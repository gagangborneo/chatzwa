import { Metadata } from 'next'
import { DashboardContent } from './dashboard-content'

export const metadata: Metadata = {
  title: "Dashboard - Chatzwa | Platform Chatbot AI",
  description: "Kelola chatbot AI Anda, monitor performa, dan konfigurasi integrasi multi-channel di dashboard Chatzwa.",
  keywords: ["Dashboard Chatbot", "Manajemen AI", "Chatzwa Dashboard", "Monitor Performa", "Integrasi WhatsApp"],
}

export default function DashboardPage() {
  return <DashboardContent />
}