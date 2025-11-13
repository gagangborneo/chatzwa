'use client'

import { useState } from 'react'
import {
  Quote,
  Star,
  ChevronLeft,
  ChevronRight,
  Users,
  Building,
  Zap
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

const TestimonialSection = () => {
  const [activeTestimonial, setActiveTestimonial] = useState(0)

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'CTO at TechCorp',
      company: 'TechCorp Solutions',
      content: 'Chatzwa telah mengubah cara kami berkomunikasi dengan pelanggan. API-nya sangat kuat dan tim support luar biasa. Kami melihat peningkatan 300% dalam engagement pelanggan sejak implementasi.',
      rating: 5,
      avatar: 'SJ',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      name: 'Michael Chen',
      role: 'Product Manager',
      company: 'GlobalStart Inc.',
      content: 'Platform CPaaS terbaik yang pernah kami gunakan. Dokumentasinya jelas, SDK-nya komprehensif, dan reliabilitasnya luar biasa. Jarang menemukan produk yang sempurna langsung dari kotaknya.',
      rating: 5,
      avatar: 'MC',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      name: 'Emily Rodriguez',
      role: 'Head of Customer Experience',
      company: 'RetailMax',
      content: 'Kami butuh solusi yang bisa skalabel dengan pertumbuhan cepat kami. Chatzwa memberikan lebih dari ekspektasi. Multi-channel messaging dan real-time analytics menjadi game-changer untuk customer service kami.',
      rating: 5,
      avatar: 'ER',
      gradient: 'from-green-500 to-emerald-500'
    }
  ]

  const stats = [
    { icon: Users, label: 'Pelanggan Aktif', value: '10.000+' },
    { icon: Building, label: 'Perusahaan Percaya', value: '500+' },
    { icon: Zap, label: 'Pesan Terkirim', value: '1M+' }
  ]

  const nextTestimonial = () => {
    setActiveTestimonial((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setActiveTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Dicintai Tim
            </span>
            <br />
            <span className="text-gray-700">di Seluruh Dunia</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Lihat apa yang dikatakan pelanggan kami tentang pengalaman mereka dengan Chatzwa.
          </p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-16 max-w-4xl mx-auto">
          {stats.map((stat, index) => (
            <Card key={index} className="bg-white border border-gray-200 shadow-sm text-center">
              <CardContent className="p-6">
                <stat.icon className="w-8 h-8 text-green-600 mx-auto mb-3" />
                <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Testimonials */}
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Main Testimonial */}
            <div key={activeTestimonial}>
              <Card className="bg-white border border-gray-200 shadow-sm">
                <CardContent className="p-8 md:p-12">
                  <div className="flex flex-col md:flex-row gap-8">
                    {/* Quote Icon */}
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl flex items-center justify-center">
                        <Quote className="w-8 h-8 text-white" />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-center gap-1 mb-4">
                        {[...Array(testimonials[activeTestimonial].rating)].map((_, i) => (
                          <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                        ))}
                      </div>

                      <blockquote className="text-xl text-gray-700 leading-relaxed mb-8">
                        "{testimonials[activeTestimonial].content}"
                      </blockquote>

                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 bg-gradient-to-r ${testimonials[activeTestimonial].gradient} rounded-full flex items-center justify-center text-white font-semibold`}>
                          {testimonials[activeTestimonial].avatar}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">
                            {testimonials[activeTestimonial].name}
                          </div>
                          <div className="text-gray-600 text-sm">
                            {testimonials[activeTestimonial].role} at {testimonials[activeTestimonial].company}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center mt-8 -mx-4">
              <Button
                onClick={prevTestimonial}
                variant="ghost"
                className="text-gray-600 hover:bg-gray-100 rounded-full p-3"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="w-6 h-6" />
              </Button>

              {/* Dots Indicator */}
              <div className="flex gap-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveTestimonial(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === activeTestimonial
                        ? 'bg-gray-900 w-8'
                        : 'bg-gray-400 hover:bg-gray-600'
                    }`}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
              </div>

              <Button
                onClick={nextTestimonial}
                variant="ghost"
                className="text-gray-600 hover:bg-gray-100 rounded-full p-3"
                aria-label="Next testimonial"
              >
                <ChevronRight className="w-6 h-6" />
              </Button>
            </div>
          </div>
        </div>

        {/* Additional Testimonials Grid */}
        <div className="mt-20 grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className={`bg-white border border-gray-200 shadow-sm p-6 cursor-pointer transition-all duration-300 hover:shadow-md ${
                index === activeTestimonial ? 'ring-2 ring-green-500' : ''
              }`}
              onClick={() => setActiveTestimonial(index)}
            >
              <div className="flex items-center gap-1 mb-3">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                {testimonial.content}
              </p>
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 bg-gradient-to-r ${testimonial.gradient} rounded-full flex items-center justify-center text-white text-xs font-semibold`}>
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="text-gray-900 text-sm font-medium">{testimonial.name}</div>
                  <div className="text-gray-600 text-xs">{testimonial.company}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

export default TestimonialSection