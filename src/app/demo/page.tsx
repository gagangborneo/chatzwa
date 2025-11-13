'use client'

import { useState, useEffect } from 'react'
import Navigation from '@/components/landing/Navigation'
import Footer from '@/components/landing/Footer'
import {
  Code,
  Copy,
  CheckCircle,
  MessageCircle,
  Settings,
  Play,
  Pause,
  RotateCcw,
  Smartphone,
  Monitor,
  Globe,
  ArrowRight
} from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const DemoPage = () => {
  const [copied, setCopied] = useState(false)
  const [demoMode, setDemoMode] = useState('live')
  const [isPlaying, setIsPlaying] = useState(false)

  const embedCode = `<!-- Chatzwa Embed Chat Widget -->
<script>
  window.EMBED_CHAT_CONFIG = {
    widgetId: "demo_widget_123",
    position: "bottom-right",
    theme: "light",
    primaryColor: "#22c55e",
    title: "Customer Support",
    subtitle: "Kami siap membantu Anda",
    welcomeMessage: "Halo! Selamat datang di demo Chatzwa. Ada yang bisa saya bantu?",
    placeholder: "Ketik pesan Anda...",
    showOnLoad: false,
    delay: 3000,
    badgeText: "Ada yang bisa saya bantu?"
  };
</script>
<script src="${typeof window !== 'undefined' ? window.location.origin : ''}/embed-chat.js" async></script>
<!-- End Chatzwa Embed Chat Widget -->`

  const handleCopyCode = () => {
    navigator.clipboard.writeText(embedCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const platforms = [
    {
      name: 'WordPress',
      icon: '📝',
      description: 'Install plugin Chatzwa dari WordPress repository',
      steps: [
        'Search "Chatzwa Chat" in WordPress plugins',
        'Install and activate the plugin',
        'Enter your API key from dashboard',
        'Configure widget appearance and behavior'
      ],
      difficulty: 'Easy',
      time: '2 minutes'
    },
    {
      name: 'HTML/CSS/JS',
      icon: '🌐',
      description: 'Copy and paste the embed script into your website',
      steps: [
        'Copy the embed code from dashboard',
        'Paste before closing </body> tag',
        'Customize configuration if needed',
        'Save and refresh your website'
      ],
      difficulty: 'Easy',
      time: '1 minute'
    },
    {
      name: 'React/Angular/Vue',
      icon: '⚛️',
      description: 'Integrate with modern JavaScript frameworks',
      steps: [
        'Install via npm: npm install Chatzwa-embed',
        'Import and configure the component',
        'Add to your application layout',
        'Customize props and styling'
      ],
      difficulty: 'Medium',
      time: '5 minutes'
    },
    {
      name: 'Shopify',
      icon: '🛍️',
      description: 'Add embed chat to your Shopify store',
      steps: [
        'Go to Theme Editor in Shopify Admin',
        'Edit theme.liquid file',
        'Paste embed code before </body>',
        'Save and preview changes'
      ],
      difficulty: 'Easy',
      time: '3 minutes'
    }
  ]

  const features = [
    {
      title: 'No Coding Required',
      description: 'Simply copy and paste the embed script into your website HTML',
      icon: '🚀'
    },
    {
      title: 'Fully Customizable',
      description: 'Customize colors, position, messages, and behavior to match your brand',
      icon: '🎨'
    },
    {
      title: 'Mobile Responsive',
      description: 'Works perfectly on desktop, tablet, and mobile devices',
      icon: '📱'
    },
    {
      title: 'Real-time Analytics',
      description: 'Track conversations, user engagement, and performance metrics',
      icon: '📊'
    },
    {
      title: 'AI Powered',
      description: 'Powered by advanced AI for intelligent and helpful responses',
      icon: '🤖'
    },
    {
      title: 'Secure & Private',
      description: 'End-to-end encryption and GDPR compliant data handling',
      icon: '🔒'
    }
  ]

  const testimonials = [
    {
      name: 'John Doe',
      role: 'Web Developer',
      company: 'Tech Agency',
      content: 'The embed chat integration was incredibly simple. It took less than 5 minutes to add to our client websites.',
      rating: 5
    },
    {
      name: 'Sarah Smith',
      role: 'E-commerce Manager',
      company: 'Online Store',
      content: 'Our customer satisfaction increased by 40% after implementing the Chatzwa chat widget.',
      rating: 5
    },
    {
      name: 'Mike Johnson',
      role: 'Business Owner',
      company: 'Startup',
      content: 'Best decision we made! The AI chat handles 80% of customer inquiries automatically.',
      rating: 5
    }
  ]

  useEffect(() => {
    // Initialize the demo chat widget
    if (typeof window !== 'undefined') {
      window.EMBED_CHAT_CONFIG = {
        widgetId: "demo_widget_123",
        position: "bottom-right",
        theme: "light",
        primaryColor: "#22c55e",
        title: "Customer Support",
        subtitle: "Kami siap membantu Anda",
        welcomeMessage: "Halo! Selamat datang di demo Chatzwa. Ada yang bisa saya bantu?",
        placeholder: "Ketik pesan Anda...",
        showOnLoad: false,
        delay: 3000,
        badgeText: "Ada yang bisa saya bantu?"
      };

      // Load the embed script
      const script = document.createElement('script');
      script.src = '/embed-chat.js';
      script.async = true;
      document.body.appendChild(script);

      return () => {
        // Cleanup
        if (document.body.contains(script)) {
          document.body.removeChild(script);
        }
      };
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navigation />

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 bg-white/20 text-white border-white/30 hover:bg-white/30">
              <Code className="w-4 h-4 mr-2" />
              Live Demo
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Embed Chat Widget
              <br />
              Live Demo
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Lihat bagaimana Chatzwa embed chat bekerja dan meningkatkan customer experience
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 rounded-xl">
                <Play className="w-5 h-5 mr-2" />
                Try Live Chat
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 rounded-xl">
                <Code className="w-5 h-5 mr-2" />
                Get Embed Code
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Instructions */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">How to Test the Demo</h2>
              <p className="text-gray-600">Follow these simple steps to try the live chat widget</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <Card className="border-gray-200 hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageCircle className="w-8 h-8 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl">1. Click Chat Button</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-600">
                    Click the green chat button that appears in the bottom-right corner of this page
                  </p>
                </CardContent>
              </Card>

              <Card className="border-gray-200 hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <CardTitle className="text-xl">2. Send Message</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-600">
                    Type a message and send it to see how the AI responds in real-time
                  </p>
                </CardContent>
              </Card>

              <Card className="border-gray-200 hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-purple-600" />
                  </div>
                  <CardTitle className="text-xl">3. Explore Features</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-600">
                    Try different questions to see the AI capabilities and response quality
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Embed Code */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Get Your Embed Code</h2>
              <p className="text-gray-600">Copy this code to add the chat widget to your website</p>
            </div>

            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Embed Script</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopyCode}
                  >
                    {copied ? (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 mr-2" />
                        Copy Code
                      </>
                    )}
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                  <code className="text-sm">{embedCode}</code>
                </pre>
              </CardContent>
            </Card>

            <div className="mt-8 text-center">
              <p className="text-gray-600 mb-4">Need help with implementation?</p>
              <Link href="/dashboard/integrations/embed-chat">
                <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                  View Full Documentation
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Integration */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Platform Integration</h2>
            <p className="text-gray-600">Easy integration with popular platforms and frameworks</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {platforms.map((platform, index) => (
              <Card key={index} className="border-gray-200 hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="text-3xl">{platform.icon}</div>
                    <div>
                      <CardTitle className="text-xl">{platform.name}</CardTitle>
                      <p className="text-gray-600 text-sm">{platform.description}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Badge variant="outline" className="border-blue-200 text-blue-600">
                      {platform.difficulty}
                    </Badge>
                    <Badge variant="outline" className="border-green-200 text-green-600">
                      {platform.time}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <ol className="space-y-2">
                    {platform.steps.map((step, stepIndex) => (
                      <li key={stepIndex} className="flex gap-2 text-sm text-gray-600">
                        <span className="font-semibold text-gray-900">{stepIndex + 1}.</span>
                        {step}
                      </li>
                    ))}
                  </ol>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Key Features</h2>
            <p className="text-gray-600">Everything you need for exceptional customer support</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-gray-200 hover:shadow-lg transition-shadow duration-300 text-center">
                <CardContent className="p-8">
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What Our Users Say</h2>
            <p className="text-gray-600">Real feedback from real customers</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-gray-200">
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <span key={i} className="text-yellow-400">⭐</span>
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4 italic">"{testimonial.content}"</p>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-500">{testimonial.role} at {testimonial.company}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Add Chat to Your Website?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join thousands of businesses using Chatzwa to provide exceptional customer support
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/dashboard">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 rounded-xl">
                  Get Started Free
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="/pricing">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 rounded-xl">
                  View Pricing
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default DemoPage