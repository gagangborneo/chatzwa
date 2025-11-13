import { Metadata } from 'next'
import Navigation from '@/components/landing/Navigation'
import HeroSection from '@/components/landing/HeroSection'
import FeaturesSection from '@/components/landing/FeaturesSection'
import ComparisonSection from '@/components/landing/ComparisonSection'
import FAQSection from '@/components/landing/FAQSection'
import Footer from '@/components/landing/Footer'

export const metadata: Metadata = {
  title: "Chatzwa - Platform Chatbot AI Indonesia | Solusi Bisnis Digital",
  description: "Platform chatbot AI terdepan di Indonesia untuk customer service, engagement, dan otomasi bisnis. Integrasi WhatsApp, website, dan multi-channel.",
  keywords: ["Platform Chatbot AI", "AI Indonesia", "Customer Service", "Otomasi Bisnis", "WhatsApp Bot", "Chatzwa"],
  openGraph: {
    title: "Chatzwa - Platform Chatbot AI Indonesia",
    description: "Platform chatbot AI terdepan untuk customer service dan otomasi bisnis",
    url: "https://chatzwa.id",
    type: "website",
  },
}

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <HeroSection />
      <FeaturesSection />
      <ComparisonSection />
      <FAQSection />
      <Footer />
    </div>
  )
}