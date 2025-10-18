'use client'

import { useState, useEffect } from 'react'
import { useI18n } from '@/lib/i18n'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  MessageCircle,
  Code,
  Copy,
  Check,
  Eye,
  EyeOff,
  Settings,
  Palette,
  Globe,
  Smartphone,
  Bot,
  Plus,
} from 'lucide-react'

interface Chatbot {
  id: string
  name: string
  description?: string | null
  apiKey: string | null
}

interface EmbedSettings {
  position: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
  showOnMobile: boolean
  autoOpen: boolean
  welcomeMessage: string
  placeholder: string
  theme: {
    primaryColor: string
    secondaryColor: string
    textColor: string
    backgroundColor: string
    buttonColor: string
  }
}

export default function EmbedChatPage() {
  const { t, locale } = useI18n()
  const router = useRouter()
  const [chatbots, setChatbots] = useState<Chatbot[]>([])
  const [isLoadingChatbots, setIsLoadingChatbots] = useState(true)
  const [selectedChatbotId, setSelectedChatbotId] = useState('')
  const [embedCode, setEmbedCode] = useState('')
  const [copied, setCopied] = useState(false)
  const [showPreview, setShowPreview] = useState(false)

  // Embed settings
  const [embedSettings, setEmbedSettings] = useState<EmbedSettings>({
    position: 'bottom-right',
    showOnMobile: true,
    autoOpen: false,
    welcomeMessage: 'Hello! How can I help you today?',
    placeholder: 'Type your message...',
    theme: {
      primaryColor: '#10b981',
      secondaryColor: '#059669',
      textColor: '#ffffff',
      backgroundColor: '#ffffff',
      buttonColor: '#10b981',
    },
  })

  useEffect(() => {
    fetchChatbots()
  }, [])

  useEffect(() => {
    generateEmbedCode()
  }, [selectedChatbotId, embedSettings])

  const fetchChatbots = async () => {
    setIsLoadingChatbots(true)
    try {
      const response = await fetch('/api/user/chatbots')
      const result = await response.json()

      if (result.success) {
        setChatbots(result.data.chatbots)
      }
    } catch (err) {
      console.error('Failed to fetch chatbots:', err)
    } finally {
      setIsLoadingChatbots(false)
    }
  }

  const generateEmbedCode = () => {
    if (!selectedChatbotId) {
      setEmbedCode('')
      return
    }

    const config = {
      chatbotId: selectedChatbotId,
      apiUrl: `${window.location.origin}/api/chat`,
      settings: embedSettings,
    }

    const embedScript = `
<!-- Chatbot Widget -->
<script>
  window.chatbotConfig = ${JSON.stringify(config, null, 2)};

  (function() {
    var script = document.createElement('script');
    script.src = '${window.location.origin}/embed/chatbot-widget.js';
    script.async = true;
    document.head.appendChild(script);
  })();
</script>
<!-- End Chatbot Widget -->`.trim()

    setEmbedCode(embedScript)
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(embedCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const createNewChatbot = () => {
    router.push('/dashboard/chatbot/create')
  }

  const selectedChatbot = chatbots.find(c => c.id === selectedChatbotId)

  if (isLoadingChatbots) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <MessageCircle className="w-6 h-6 text-green-600" />
            Embed Chat Widget
          </h1>
          <p className="text-gray-500 mt-1">
            Add a floating chat widget to any website with a simple code snippet
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Configuration */}
        <div className="lg:col-span-2 space-y-6">
          {/* Chatbot Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="w-5 h-5" />
                Select Chatbot
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {chatbots.length === 0 ? (
                <div className="text-center py-8">
                  <Bot className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No chatbots available</h3>
                  <p className="text-gray-500 mb-4">
                    Create a chatbot first to embed it on your website
                  </p>
                  <Button onClick={createNewChatbot}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Chatbot
                  </Button>
                </div>
              ) : (
                <div>
                  <Label htmlFor="chatbot">Choose a chatbot to embed</Label>
                  <Select value={selectedChatbotId} onValueChange={setSelectedChatbotId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a chatbot" />
                    </SelectTrigger>
                    <SelectContent>
                      {chatbots.map((chatbot) => (
                        <SelectItem key={chatbot.id} value={chatbot.id}>
                          <div className="flex items-center gap-2">
                            <Bot className="w-4 h-4" />
                            <div>
                              <div className="font-medium">{chatbot.name}</div>
                              {chatbot.description && (
                                <div className="text-sm text-gray-500">{chatbot.description}</div>
                              )}
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {selectedChatbot && (
                    <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-center gap-2 text-green-800">
                        <Check className="w-4 h-4" />
                        <span className="font-medium">Ready to embed</span>
                      </div>
                      <p className="text-green-700 text-sm mt-1">
                        {selectedChatbot.name} is ready to be embedded on your website
                      </p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Customization */}
          {selectedChatbotId && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Widget Customization
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="appearance" className="space-y-4">
                  <TabsList>
                    <TabsTrigger value="appearance">Appearance</TabsTrigger>
                    <TabsTrigger value="behavior">Behavior</TabsTrigger>
                    <TabsTrigger value="advanced">Advanced</TabsTrigger>
                  </TabsList>

                  <TabsContent value="appearance" className="space-y-4">
                    <div>
                      <Label>Widget Position</Label>
                      <Select
                        value={embedSettings.position}
                        onValueChange={(value: any) =>
                          setEmbedSettings({
                            ...embedSettings,
                            position: value,
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="bottom-right">Bottom Right</SelectItem>
                          <SelectItem value="bottom-left">Bottom Left</SelectItem>
                          <SelectItem value="top-right">Top Right</SelectItem>
                          <SelectItem value="top-left">Top Left</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Primary Color</Label>
                        <div className="flex gap-2">
                          <Input
                            type="color"
                            value={embedSettings.theme.primaryColor}
                            onChange={(e) =>
                              setEmbedSettings({
                                ...embedSettings,
                                theme: {
                                  ...embedSettings.theme,
                                  primaryColor: e.target.value,
                                },
                              })
                            }
                            className="w-20 h-10"
                          />
                          <Input
                            value={embedSettings.theme.primaryColor}
                            onChange={(e) =>
                              setEmbedSettings({
                                ...embedSettings,
                                theme: {
                                  ...embedSettings.theme,
                                  primaryColor: e.target.value,
                                },
                              })
                            }
                          />
                        </div>
                      </div>

                      <div>
                        <Label>Button Color</Label>
                        <div className="flex gap-2">
                          <Input
                            type="color"
                            value={embedSettings.theme.buttonColor}
                            onChange={(e) =>
                              setEmbedSettings({
                                ...embedSettings,
                                theme: {
                                  ...embedSettings.theme,
                                  buttonColor: e.target.value,
                                },
                              })
                            }
                            className="w-20 h-10"
                          />
                          <Input
                            value={embedSettings.theme.buttonColor}
                            onChange={(e) =>
                              setEmbedSettings({
                                ...embedSettings,
                                theme: {
                                  ...embedSettings.theme,
                                  buttonColor: e.target.value,
                                },
                              })
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="behavior" className="space-y-4">
                    <div>
                      <Label htmlFor="welcomeMessage">Welcome Message</Label>
                      <Input
                        id="welcomeMessage"
                        value={embedSettings.welcomeMessage}
                        onChange={(e) =>
                          setEmbedSettings({
                            ...embedSettings,
                            welcomeMessage: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div>
                      <Label htmlFor="placeholder">Input Placeholder</Label>
                      <Input
                        id="placeholder"
                        value={embedSettings.placeholder}
                        onChange={(e) =>
                          setEmbedSettings({
                            ...embedSettings,
                            placeholder: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Show on Mobile</Label>
                        <p className="text-sm text-gray-500">
                          Display chat widget on mobile devices
                        </p>
                      </div>
                      <Switch
                        checked={embedSettings.showOnMobile}
                        onCheckedChange={(checked) =>
                          setEmbedSettings({ ...embedSettings, showOnMobile: checked })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Auto Open</Label>
                        <p className="text-sm text-gray-500">
                          Automatically open chat widget on page load
                        </p>
                      </div>
                      <Switch
                        checked={embedSettings.autoOpen}
                        onCheckedChange={(checked) =>
                          setEmbedSettings({ ...embedSettings, autoOpen: checked })
                        }
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="advanced" className="space-y-4">
                    <div className="text-center py-8">
                      <Code className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Advanced Options</h3>
                      <p className="text-gray-500">
                        Additional customization options will be available soon
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          )}

          {/* Embed Code */}
          {selectedChatbotId && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="w-5 h-5" />
                  Embed Code
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Copy and paste this code into your website</Label>
                  <div className="relative">
                    <Textarea
                      value={embedCode}
                      readOnly
                      rows={12}
                      className="font-mono text-sm bg-gray-50"
                    />
                    <Button
                      onClick={copyToClipboard}
                      variant="outline"
                      size="sm"
                      className="absolute top-2 right-2"
                    >
                      {copied ? (
                        <Check className="w-4 h-4 mr-2" />
                      ) : (
                        <Copy className="w-4 h-4 mr-2" />
                      )}
                      {copied ? 'Copied!' : 'Copy'}
                    </Button>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    Add this code before the closing &lt;/body&gt; tag on your website
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    onClick={() => setShowPreview(!showPreview)}
                    className="flex items-center gap-2"
                  >
                    {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    {showPreview ? 'Hide Preview' : 'Show Preview'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Preview */}
          {selectedChatbotId && showPreview && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  Live Preview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative h-64 bg-gray-100 rounded-lg overflow-hidden">
                  <div
                    className={`absolute ${
                      embedSettings.position === 'bottom-right'
                        ? 'bottom-4 right-4'
                        : embedSettings.position === 'bottom-left'
                        ? 'bottom-4 left-4'
                        : embedSettings.position === 'top-right'
                        ? 'top-4 right-4'
                        : 'top-4 left-4'
                    }`}
                  >
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center text-white cursor-pointer shadow-lg"
                      style={{ backgroundColor: embedSettings.theme.buttonColor }}
                    >
                      <MessageCircle className="w-6 h-6" />
                    </div>
                  </div>

                  {/* Chat preview */}
                  <div className="absolute bottom-20 right-4 w-64 h-48 bg-white rounded-lg shadow-xl border border-gray-200">
                    <div
                      className="p-3 rounded-t-lg flex items-center justify-between"
                      style={{ backgroundColor: embedSettings.theme.primaryColor }}
                    >
                      <span className="text-white text-sm font-medium">Chat Assistant</span>
                      <span className="text-white text-xs">×</span>
                    </div>
                    <div className="p-3 text-sm text-gray-600">
                      {embedSettings.welcomeMessage}
                    </div>
                    <div className="absolute bottom-3 left-3 right-3 flex gap-2">
                      <input
                        type="text"
                        placeholder={embedSettings.placeholder}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-full text-sm"
                        readOnly
                      />
                      <button
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white"
                        style={{ backgroundColor: embedSettings.theme.primaryColor }}
                      >
                        <span className="text-xs">→</span>
                      </button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Instructions */}
          <Card>
            <CardHeader>
              <CardTitle>Installation Instructions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium mt-0.5">1</div>
                <p>Copy the embed code from the code block above</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium mt-0.5">2</div>
                <p>Paste it into your website's HTML before the &lt;/body&gt; tag</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium mt-0.5">3</div>
                <p>Save and refresh your website to see the chat widget</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-medium mt-0.5">✓</div>
                <p>That's it! Your chat widget is now live</p>
              </div>
            </CardContent>
          </Card>

          {/* Features */}
          <Card>
            <CardHeader>
              <CardTitle>Widget Features</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-blue-500" />
                <span>Mobile responsive design</span>
              </div>
              <div className="flex items-center gap-2">
                <Palette className="w-4 h-4 text-purple-500" />
                <span>Customizable colors and position</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-green-500" />
                <span>Real-time chat with your chatbot</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-orange-500" />
                <span>Works on any website platform</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}