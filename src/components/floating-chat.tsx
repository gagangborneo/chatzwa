'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Card, CardFloat, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  MessageCircle,
  Send,
  X,
  Minimize2,
  Maximize2,
  Bot,
  User,
  Trash2,
  Phone,
  Mail,
  MapPin
} from 'lucide-react'
import { useI18n } from '@/lib/i18n'

interface Message {
  id: string
  message: string
  response: string
  timestamp: Date
  isUser: boolean
}

export default function FloatingChat() {
  const { t, language } = useI18n()
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [inputMessage, setInputMessage] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
      setIsMobile(isMobileDevice)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    }
  }, [isOpen, isMinimized])

  // Initialize with welcome message
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage: Message = {
        id: 'welcome',
        message: '',
        response: language === 'id'
          ? '👋 Selamat datang! Saya adalah asisten AI yang siap membantu Anda. Ada yang bisa saya bantu hari ini?'
          : '👋 Welcome! I am an AI assistant ready to help you. How can I assist you today?',
        timestamp: new Date(),
        isUser: false
      }
      setMessages([welcomeMessage])
    }
  }, [language, messages.length])

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      message: inputMessage.trim(),
      response: '',
      timestamp: new Date(),
      isUser: true
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)

    try {
      // Call the chat API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputMessage.trim(),
          sessionId: 'floating-chat'
        })
      })

      if (response.ok) {
        const data = await response.json()
        const aiMessage: Message = {
          id: `ai-${Date.now()}`,
          message: inputMessage.trim(),
          response: data.response,
          timestamp: new Date(),
          isUser: false
        }
        setMessages(prev => [...prev, aiMessage])
      } else {
        throw new Error('Failed to get response')
      }
    } catch (error) {
      console.error('Error sending message:', error)
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        message: inputMessage.trim(),
        response: language === 'id'
          ? 'Maaf, terjadi kesalahan. Silakan coba lagi.'
          : 'Sorry, an error occurred. Please try again.',
        timestamp: new Date(),
        isUser: false
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleToggleChat = () => {
    setIsOpen(!isOpen)
    if (!isOpen) {
      setUnreadCount(0)
    }
  }

  const handleMinimize = () => {
    setIsMinimized(!isMinimized)
  }

  const handleClearChat = () => {
    setMessages([])
    setUnreadCount(0)
    // Re-add welcome message
    const welcomeMessage: Message = {
      id: 'welcome',
      message: '',
      response: language === 'id'
        ? '👋 Selamat datang! Saya adalah asisten AI yang siap membantu Anda. Ada yang bisa saya bantu hari ini?'
        : '👋 Welcome! I am an AI assistant ready to help you. How can I assist you today?',
      timestamp: new Date(),
      isUser: false
    }
    setMessages([welcomeMessage])
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  // Simulate unread messages when chat is closed
  useEffect(() => {
    if (!isOpen) {
      const interval = setInterval(() => {
        setUnreadCount(prev => prev + 1)
      }, 30000) // Add unread message every 30 seconds for demo

      return () => clearInterval(interval)
    }
  }, [isOpen])

  return (
    <>
      {/* Floating Chat Button */}
      <div className="fixed bottom-4 right-4 z-50">
        {!isOpen && (
          <Button
            onClick={handleToggleChat}
            size="lg"
            className="relative h-14 w-14 rounded-full shadow-lg bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 transition-all duration-300 hover:scale-110"
          >
            <MessageCircle className="w-6 h-6" />
            {unreadCount > 0 && (
              <Badge
                variant="destructive"
                className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
              >
                {unreadCount > 9 ? '9+' : unreadCount}
              </Badge>
            )}
          </Button>
        )}
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className={`z-50 transition-all duration-300 ease-in-out ${
          isMobile
            ? 'fixed inset-0 w-full h-full'
            : 'fixed bottom-4 right-4'
        }`}>
          <CardFloat className={`shadow-2xl border-0 bg-white ${
            isMobile
              ? 'w-full h-full rounded-none'
              : `${isMinimized ? 'w-80' : 'w-96 h-[600px]'}`
          } transition-all duration-300`}>
            {/* Header */}
            <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-4 pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div>
                    <CardTitle className="text-sm font-medium">
                      {language === 'id' ? 'Asisten AI' : 'AI Assistant'}
                    </CardTitle>
                    <p className="text-xs opacity-90">
                      {language === 'id' ? 'Selalu online' : 'Always online'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-white hover:bg-white/20"
                    onClick={handleMinimize}
                  >
                    {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-white hover:bg-white/20"
                    onClick={handleClearChat}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-white hover:bg-white/20"
                    onClick={handleToggleChat}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            {!isMinimized && (
              <>
                {/* Messages Area */}
                <CardContent className={`p-0 ${
                  isMobile
                    ? 'h-[calc(100vh-8rem)]'
                    : 'h-[480px]'
                }`}>
                  <ScrollArea className={`h-full ${isMobile ? 'px-2' : 'px-4'}`}>
                    <div className={`space-y-4 ${isMobile ? 'py-2' : 'py-4'}`}>
                      {messages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`flex gap-2 ${isMobile ? 'max-w-[90%]' : 'max-w-[80%]'} ${msg.isUser ? 'flex-row-reverse' : ''}`}>
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                              msg.isUser
                                ? 'bg-green-500 text-white ml-2'
                                : 'bg-gray-200 text-gray-600 mr-2'
                            }`}>
                              {msg.isUser ? <User className="w-3 h-3" /> : <Bot className="w-3 h-3" />}
                            </div>
                            <div className={`rounded-2xl px-4 py-2 ${
                              msg.isUser
                                ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-tr-none'
                                : 'bg-gray-100 text-gray-900 rounded-tl-none'
                            }`}>
                              {msg.isUser ? (
                                <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                              ) : (
                                <div className="space-y-2">
                                  <p className="text-sm whitespace-pre-wrap">{msg.response}</p>
                                </div>
                              )}
                              <p className={`text-xs mt-1 ${
                                msg.isUser ? 'text-green-100' : 'text-gray-500'
                              }`}>
                                {formatTime(msg.timestamp)}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}

                      {/* Loading indicator */}
                      {isLoading && (
                        <div className="flex justify-start">
                          <div className="flex gap-2 max-w-[80%]">
                            <div className="w-6 h-6 rounded-full bg-gray-200 text-gray-600 mr-2 flex items-center justify-center">
                              <Bot className="w-3 h-3" />
                            </div>
                            <div className="bg-gray-100 rounded-2xl rounded-tl-none px-4 py-2">
                              <div className="flex space-x-1">
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      <div ref={messagesEndRef} />
                    </div>
                  </ScrollArea>
                </CardContent>

                {/* Input Area */}
                <div className={`border-t bg-gray-50 ${isMobile ? 'p-3' : 'p-4'}`}>
                  <div className={`flex gap-2 ${isMobile ? 'gap-3' : 'gap-2'}`}>
                    <Input
                      ref={inputRef}
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder={language === 'id' ? 'Ketik pesan...' : 'Type a message...'}
                      className={`flex-1 border-gray-300 focus:border-green-500 focus:ring-green-500 ${
                        isMobile ? 'text-base py-3' : ''
                      }`}
                      disabled={isLoading}
                      maxLength={1000}
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!inputMessage.trim() || isLoading}
                      className={`bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white ${
                        isMobile ? 'px-6' : 'px-4'
                      }`}
                    >
                      <Send className={`w-4 h-4 ${isMobile ? 'w-5 h-5' : ''}`} />
                    </Button>
                  </div>

                  {/* Quick Actions */}
                  <div className={`flex gap-2 mt-2 ${isMobile ? 'flex-wrap justify-center' : ''}`}>
                    <Button
                      variant="outline"
                      size={isMobile ? "default" : "sm"}
                      className={`${isMobile ? 'text-sm flex-1' : 'text-xs'}`}
                      onClick={() => setInputMessage(language === 'id' ? 'Halo, saya butuh bantuan' : 'Hello, I need help')}
                    >
                      {language === 'id' ? 'Butuh Bantuan' : 'Need Help'}
                    </Button>
                    <Button
                      variant="outline"
                      size={isMobile ? "default" : "sm"}
                      className={`${isMobile ? 'text-sm flex-1' : 'text-xs'}`}
                      onClick={() => setInputMessage(language === 'id' ? 'Bagaimana cara kerjanya?' : 'How does it work?')}
                    >
                      {language === 'id' ? 'Cara Kerja' : 'How it Works'}
                    </Button>
                    <Button
                      variant="outline"
                      size={isMobile ? "default" : "sm"}
                      className={`${isMobile ? 'text-sm flex-1' : 'text-xs'}`}
                      onClick={() => setInputMessage(language === 'id' ? 'Hubungi admin' : 'Contact admin')}
                    >
                      {language === 'id' ? 'Hubungi Admin' : 'Contact Admin'}
                    </Button>
                  </div>
                </div>
              </>
            )}
          </CardFloat>
        </div>
      )}

      </>
  )
}