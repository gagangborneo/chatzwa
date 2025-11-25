import { Metadata } from 'next'
import PricingPage from './pricing-page'

export const metadata: Metadata = {
  title: "Harga - Chatzwa | Platform Chatbot AI Indonesia",
  description: "Paket harga terbaik untuk platform chatbot AI Chatzwa. Mulai dari Starter hingga Enterprise dengan fitur lengkap untuk bisnis Anda.",
  keywords: ["Harga Chatbot", "Pricing AI", "Paket Chatbot", "Chatzwa Harga", "Platform AI Indonesia"],
}

export default function Pricing() {
  return <PricingPage />
}