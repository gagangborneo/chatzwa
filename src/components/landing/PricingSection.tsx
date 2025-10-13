'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import {
  Check,
  X,
  Star,
  Zap,
  Crown,
  Building,
  ArrowRight,
  Sparkles
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const PricingSection = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  })
  const [isAnnual, setIsAnnual] = useState(false)

  const plans = [
    {
      name: 'Starter',
      description: 'Perfect for small teams and startups',
      icon: Sparkles,
      price: { monthly: 29, annual: 290 },
      color: 'from-blue-500 to-cyan-500',
      features: [
        { name: '10,000 messages/month', included: true },
        { name: '2 users', included: true },
        { name: 'Basic analytics', included: true },
        { name: 'Email support', included: true },
        { name: 'API access', included: true },
        { name: 'Custom integrations', included: false },
        { name: 'Priority support', included: false },
        { name: 'Advanced security', included: false }
      ],
      popular: false
    },
    {
      name: 'Professional',
      description: 'Ideal for growing businesses',
      icon: Zap,
      price: { monthly: 99, annual: 990 },
      color: 'from-purple-500 to-pink-500',
      features: [
        { name: '100,000 messages/month', included: true },
        { name: '10 users', included: true },
        { name: 'Advanced analytics', included: true },
        { name: '24/7 chat support', included: true },
        { name: 'API access', included: true },
        { name: 'Custom integrations', included: true },
        { name: 'Priority support', included: false },
        { name: 'Advanced security', included: false }
      ],
      popular: true
    },
    {
      name: 'Enterprise',
      description: 'For large organizations with custom needs',
      icon: Crown,
      price: { monthly: 299, annual: 2990 },
      color: 'from-orange-500 to-red-500',
      features: [
        { name: 'Unlimited messages', included: true },
        { name: 'Unlimited users', included: true },
        { name: 'Custom analytics', included: true },
        { name: 'Dedicated account manager', included: true },
        { name: 'API access', included: true },
        { name: 'Custom integrations', included: true },
        { name: 'Priority support', included: true },
        { name: 'Advanced security', included: true }
      ],
      popular: false
    }
  ]

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(price)
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
              Simple, Transparent
            </span>
            <br />
            <span className="text-white">Pricing</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Choose the perfect plan for your business. Scale up or down anytime.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4">
            <span className={`text-lg ${!isAnnual ? 'text-white' : 'text-gray-400'}`}>
              Monthly
            </span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className="relative inline-flex h-8 w-14 items-center rounded-full bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-slate-900"
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-gradient-to-r from-purple-600 to-pink-600 transition-transform ${
                  isAnnual ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`text-lg ${isAnnual ? 'text-white' : 'text-gray-400'}`}>
              Annual
              <Badge className="ml-2 bg-green-500 text-white">Save 20%</Badge>
            </span>
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.1 * index }}
              className={`relative ${plan.popular ? 'z-10' : ''}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 text-sm font-semibold">
                    <Star className="w-4 h-4 mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )}

              <Card className={`h-full bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 ${
                plan.popular ? 'border-purple-500/50 shadow-2xl shadow-purple-500/20' : ''
              }`}>
                <CardHeader className="text-center pb-8">
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${plan.color} flex items-center justify-center mx-auto mb-4`}>
                    <plan.icon className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-white mb-2">
                    {plan.name}
                  </CardTitle>
                  <p className="text-gray-300 mb-6">{plan.description}</p>
                  <div className="flex items-baseline justify-center gap-2">
                    <span className="text-4xl font-bold text-white">
                      {formatPrice(isAnnual ? plan.price.annual / 12 : plan.price.monthly)}
                    </span>
                    <span className="text-gray-400">/month</span>
                  </div>
                  {isAnnual && (
                    <p className="text-sm text-green-400 mt-2">
                      {formatPrice(plan.price.annual)} billed annually
                    </p>
                  )}
                </CardHeader>

                <CardContent className="flex-1 flex flex-col">
                  <div className="flex-1 space-y-4 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-start gap-3">
                        {feature.included ? (
                          <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                        ) : (
                          <X className="w-5 h-5 text-gray-500 flex-shrink-0 mt-0.5" />
                        )}
                        <span className={`text-sm ${feature.included ? 'text-gray-200' : 'text-gray-500'}`}>
                          {feature.name}
                        </span>
                      </div>
                    ))}
                  </div>

                  <Button
                    className={`w-full py-3 font-semibold rounded-xl transition-all duration-300 group ${
                      plan.popular
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-purple-500/25'
                        : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                    }`}
                  >
                    Get Started
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <div className="bg-white/5 rounded-2xl p-8 backdrop-blur-sm border border-white/10">
            <Building className="w-12 h-12 text-purple-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-4">
              Need a Custom Solution?
            </h3>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              We offer tailored solutions for enterprise customers with specific requirements.
              Contact our sales team to discuss your needs.
            </p>
            <Button variant="outline" className="px-8 py-3 border-white/20 text-white hover:bg-white/10 rounded-xl backdrop-blur-sm">
              Contact Sales
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default PricingSection