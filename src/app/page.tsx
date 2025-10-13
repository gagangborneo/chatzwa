'use client'

import Navigation from '@/components/landing/Navigation'
import HeroSection from '@/components/landing/HeroSection'
import FeaturesSection from '@/components/landing/FeaturesSection'
import TestimonialSection from '@/components/landing/TestimonialSection'
import PricingSection from '@/components/landing/PricingSection'
import ContactSection from '@/components/landing/ContactSection'
import Footer from '@/components/landing/Footer'

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-900">
      <Navigation />
      <HeroSection />
      <FeaturesSection />
      <TestimonialSection />
      <PricingSection />
      <ContactSection />
      <Footer />
    </div>
  )
}