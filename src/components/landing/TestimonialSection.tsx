'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
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
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  })

  const [activeTestimonial, setActiveTestimonial] = useState(0)

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'CTO at TechCorp',
      company: 'TechCorp Solutions',
      content: 'CPaaS Pro has transformed how we communicate with our customers. The API is incredibly robust and the support team is exceptional. We\'ve seen a 300% increase in customer engagement since implementation.',
      rating: 5,
      avatar: 'SJ',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      name: 'Michael Chen',
      role: 'Product Manager',
      company: 'GlobalStart Inc.',
      content: 'The best CPaaS platform we\'ve ever used. The documentation is clear, the SDKs are comprehensive, and the reliability is outstanding. It\'s rare to find a product that just works perfectly out of the box.',
      rating: 5,
      avatar: 'MC',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      name: 'Emily Rodriguez',
      role: 'Head of Customer Experience',
      company: 'RetailMax',
      content: 'We needed a solution that could scale with our rapid growth. CPaaS Pro delivered beyond our expectations. The multi-channel messaging and real-time analytics have been game-changers for our customer service.',
      rating: 5,
      avatar: 'ER',
      gradient: 'from-green-500 to-emerald-500'
    }
  ]

  const stats = [
    { icon: Users, label: 'Active Customers', value: '10,000+' },
    { icon: Building, label: 'Companies Trust Us', value: '500+' },
    { icon: Zap, label: 'Messages Delivered', value: '1B+' }
  ]

  const nextTestimonial = () => {
    setActiveTestimonial((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setActiveTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <section ref={ref} className="py-20 bg-gradient-to-b from-purple-900/20 to-slate-900">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Loved by Teams
            </span>
            <br />
            <span className="text-white">Worldwide</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            See what our customers have to say about their experience with CPaaS Pro.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid md:grid-cols-3 gap-6 mb-16 max-w-4xl mx-auto"
        >
          {stats.map((stat, index) => (
            <Card key={index} className="bg-white/5 border-white/10 backdrop-blur-sm text-center">
              <CardContent className="p-6">
                <stat.icon className="w-8 h-8 text-purple-400 mx-auto mb-3" />
                <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Testimonials */}
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Main Testimonial */}
            <motion.div
              key={activeTestimonial}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                <CardContent className="p-8 md:p-12">
                  <div className="flex flex-col md:flex-row gap-8">
                    {/* Quote Icon */}
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center">
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

                      <blockquote className="text-xl text-gray-200 leading-relaxed mb-8">
                        "{testimonials[activeTestimonial].content}"
                      </blockquote>

                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 bg-gradient-to-r ${testimonials[activeTestimonial].gradient} rounded-full flex items-center justify-center text-white font-semibold`}>
                          {testimonials[activeTestimonial].avatar}
                        </div>
                        <div>
                          <div className="font-semibold text-white">
                            {testimonials[activeTestimonial].name}
                          </div>
                          <div className="text-gray-400 text-sm">
                            {testimonials[activeTestimonial].role} at {testimonials[activeTestimonial].company}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center mt-8 -mx-4">
              <Button
                onClick={prevTestimonial}
                variant="ghost"
                className="text-white hover:bg-white/10 rounded-full p-3"
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
                        ? 'bg-white w-8'
                        : 'bg-white/30 hover:bg-white/50'
                    }`}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
              </div>

              <Button
                onClick={nextTestimonial}
                variant="ghost"
                className="text-white hover:bg-white/10 rounded-full p-3"
                aria-label="Next testimonial"
              >
                <ChevronRight className="w-6 h-6" />
              </Button>
            </div>
          </div>
        </div>

        {/* Additional Testimonials Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-20 grid md:grid-cols-3 gap-6"
        >
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className={`bg-white/5 border-white/10 backdrop-blur-sm p-6 cursor-pointer transition-all duration-300 hover:bg-white/10 ${
                index === activeTestimonial ? 'ring-2 ring-purple-500' : ''
              }`}
              onClick={() => setActiveTestimonial(index)}
            >
              <div className="flex items-center gap-1 mb-3">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-300 text-sm leading-relaxed mb-4 line-clamp-3">
                {testimonial.content}
              </p>
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 bg-gradient-to-r ${testimonial.gradient} rounded-full flex items-center justify-center text-white text-xs font-semibold`}>
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="text-white text-sm font-medium">{testimonial.name}</div>
                  <div className="text-gray-400 text-xs">{testimonial.company}</div>
                </div>
              </div>
            </Card>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default TestimonialSection