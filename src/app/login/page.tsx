import { Metadata } from 'next'
import LoginClient from './login-client'

export const metadata: Metadata = {
  title: "Login - Chatzwa | Platform Chatbot AI",
  description: "Masuk ke dashboard Chatzwa untuk mengelola chatbot AI Anda. Akses analytics, integrasi, dan pengaturan platform.",
  keywords: ["Login Chatzwa", "Masuk Chatbot", "Dashboard AI", "Platform Chatbot Indonesia"],
}

export default function LoginPage() {
  return <LoginClient />
}