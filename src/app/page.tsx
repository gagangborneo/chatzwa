'use client'

import Navigation from '@/components/landing/Navigation'
import HeroSection from '@/components/landing/HeroSection'
import FeaturesSection from '@/components/landing/FeaturesSection'
import TestimonialSection from '@/components/landing/TestimonialSection'
import FAQSection from '@/components/landing/FAQSection'
import Footer from '@/components/landing/Footer'

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <HeroSection />
      <FeaturesSection />
      <TestimonialSection />
      <FAQSection />
      <Footer />
    </div>
  )
}