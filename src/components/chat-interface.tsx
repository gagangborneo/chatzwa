'use client'

import { useState, useEffect, useRef } from 'react'
import { useI18n } from '@/lib/i18n'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Send, Bot, RotateCcw } from 'lucide-react'
import { ChatStorage } from '@/lib/chat-storage'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize from 'rehype-sanitize'

interface Message {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: Date
}

// Function to clean and format AI response text
const formatResponseText = (text: string): string => {
  if (!text) return text

  return text
    // Normalize multiple spaces to single space
    .replace(/\s+/g, ' ')
    // Trim leading and trailing spaces
    .trim()
    // Fix space before punctuation
    .replace(/\s+([,.!?;:])/g, '$1')
    // Fix space after punctuation (but not before line breaks)
    .replace(/([,.!?;:])(?![\s\n])/g, '$1 ')
    // Fix multiple punctuation (keep maximum 2 for emphasis)
    .replace(/([.!?])\1{2,}/g, '$1$1')
    .replace(/([,;:])\1+/g, '$1')
    // Fix spacing around parentheses
    .replace(/\s*\(\s*/g, ' (')
    .replace(/\s*\)\s*/g, ') ')
    // Fix quotes spacing
    .replace(/\s*"([^"]*?)"\s*/g, ' "$1" ')
    .replace(/\s*'([^']*?)'\s*/g, " '$1' ")
    // Ensure proper sentence endings (don't add if sentence ends with question/exclamation)
    .replace(/([^.!?])\s*$/gm, (match, p1) => {
      // Don't add period if the text ends with common closing phrases
      const closingPhrases = ['terima kasih', 'thank you', ' Wassalam', 'wasalam', 'wassalam']
      const lowerMatch = match.toLowerCase()
      if (closingPhrases.some(phrase => lowerMatch.includes(phrase))) {
        return match.trim()
      }
      return p1 + '.'
    })
    // Clean up extra spaces again
    .replace(/\s{2,}/g, ' ')
    .trim()
}

interface ChatInterfaceProps {
  personaOverride?: any
}

export default function ChatInterface({ personaOverride }: ChatInterfaceProps = {}) {
  const { t } = useI18n()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [persona, setPersona] = useState<any>(null)
  const [personaLoading, setPersonaLoading] = useState(true)
  const [storageAvailable, setStorageAvailable] = useState(true)
  const scrollRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Initialize component: load persona and conversation
  useEffect(() => {
    initializeChat()
  }, [personaOverride])

  // Auto-save messages whenever they change
  useEffect(() => {
    if (messages.length > 1 && storageAvailable) { // Only save if there are actual messages beyond welcome
      ChatStorage.saveConversation(messages)
    }
  }, [messages, storageAvailable])

  const initializeChat = async () => {
    // Check if localStorage is available
    const isStorageAvailable = ChatStorage.isStorageAvailable()
    setStorageAvailable(isStorageAvailable)

    // Use persona override if provided, otherwise load active persona
    if (personaOverride) {
      setPersona(personaOverride)
      setPersonaLoading(false)

      // Add welcome message with persona override
      const welcomeMessage: Message = {
        id: '1',
        content: personaOverride.welcomeMessage || t('chat.welcome'),
        role: 'assistant',
        timestamp: new Date()
      }
      setMessages([welcomeMessage])
      return
    } else {
      // Load active persona
      await loadActivePersona()
    }

    // Load saved conversation if available
    if (isStorageAvailable) {
      const savedMessages = ChatStorage.loadConversation()
      if (savedMessages && savedMessages.length > 0) {
        setMessages(savedMessages)
        return // Don't add welcome message if we have saved conversation
      }
    }

    // Add welcome message if no saved conversation
    const welcomeMessage: Message = {
      id: '1',
      content: t('chat.welcome'),
      role: 'assistant',
      timestamp: new Date()
    }
    setMessages([welcomeMessage])
  }

  const loadActivePersona = async () => {
    try {
      setPersonaLoading(true)
      const response = await fetch('/api/persona?active=true')
      const data = await response.json()

      if (data.success && data.data) {
        setPersona(data.data)

        // Update welcome message with persona's welcome message only if no saved conversation
        if (messages.length === 0 || (messages.length === 1 && messages[0].id === '1')) {
          setMessages([
            {
              id: '1',
              content: data.data.welcomeMessage || t('chat.welcome'),
              role: 'assistant',
              timestamp: new Date()
            }
          ])
        }
      }
    } catch (error) {
      console.error('Error loading persona:', error)
    } finally {
      setPersonaLoading(false)
    }
  }

  const clearConversation = () => {
    if (storageAvailable) {
      ChatStorage.clearUserConversation()
    }

    // Reset to welcome message
    const welcomeMessage: Message = {
      id: '1',
      content: persona?.welcomeMessage || t('chat.welcome'),
      role: 'assistant',
      timestamp: new Date()
    }
    setMessages([welcomeMessage])
  }

  // Message length limit
  const MAX_MESSAGE_LENGTH = 1000

  // Auto-scroll to bottom when messages change or loading state changes
  useEffect(() => {
    scrollToBottom()
  }, [messages, isLoading])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSendMessage = async () => {
    if (!input.trim()) return

    // Check message length
    if (input.length > MAX_MESSAGE_LENGTH) {
      alert(t('chat.tooLong', { max: MAX_MESSAGE_LENGTH }))
      return
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: input }),
      })

      if (!response.ok) {
        throw new Error('Failed to get response')
      }

      const data = await response.json()
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response,
        role: 'assistant',
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Error sending message:', error)
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: t('chat.errorMessage'),
        role: 'assistant',
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    if (value.length <= MAX_MESSAGE_LENGTH) {
      setInput(value)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && e.shiftKey) {
      // Allow Shift+Enter for new line
      return
    } else if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto h-[85vh] flex flex-col bg-white shadow-xl border-0 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 border-b border-gray-100 flex-shrink-0 px-6 py-4">
        <div className="flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center">
                <Bot className="h-4 w-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-semibold">
                  {personaLoading ? 'Loading...' : (persona?.name || t('chat.title'))}
                </span>
                <span className="text-xs text-green-100 opacity-90">
                  {persona ? `${persona.selectedProfile === 'islamic_educator' ? 'Pendidik Islam' :
                               persona.selectedProfile === 'customer_service' ? 'Layanan Pelanggan' :
                               persona.selectedProfile === 'academic_assistant' ? 'Asisten Akademik' :
                               persona.selectedProfile === 'friendly_guide' ? 'Pemandu Ramah' :
                               persona.selectedProfile === 'professional_advisor' ? 'Penasihat Profesional' : 'Assistant'}` : t('chat.subtitle')}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {storageAvailable && messages.length > 1 && (
              <Button
                onClick={clearConversation}
                variant="ghost"
                size="sm"
                className="text-white/80 hover:text-white hover:bg-white/20"
                title="Hapus percakapan"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            )}

            {persona && !personaLoading && (
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                Active
              </Badge>
            )}
          </div>
        </div>
      </div>
      
      {/* Messages Area */}
      <div className="flex-1 flex flex-col min-h-0 bg-gradient-to-b from-gray-50 to-white">
        <ScrollArea 
          ref={scrollRef}
          className="flex-1 p-4 md:p-6 overflow-y-auto"
        >
          <div className="space-y-4 md:space-y-6 pb-2">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex flex-col ${
                  message.role === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                {message.role === 'assistant' && (
                  <span className="text-xs text-gray-500 mb-1">
                    {persona?.name || 'Attallah'}
                  </span>
                )}
                
                <div
                  className={`max-w-[90%] md:max-w-[80%] rounded-2xl px-4 md:px-5 py-3 md:py-4 shadow-sm ${
                    message.role === 'user'
                      ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-br-none shadow-lg'
                      : 'bg-white text-gray-800 rounded-bl-none border border-gray-100'
                  }`}
                >
                  {message.role === 'user' ? (
                    <div className="text-sm leading-relaxed whitespace-pre-wrap">
                      {message.content}
                    </div>
                  ) : (
                    <div className="prose prose-sm max-w-none prose-gray prose-headings:mb-2 prose-p:mb-2 prose-ul:mb-2 prose-ol:mb-2 prose-li:mb-1 prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-sm">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[rehypeRaw, rehypeSanitize]}
                        components={{
                          // Custom styling for list items
                          ul: ({ children, ...props }) => (
                            <ul className="list-disc list-inside space-y-1 my-2" {...props}>
                              {children}
                            </ul>
                          ),
                          ol: ({ children, ...props }) => (
                            <ol className="list-decimal list-inside space-y-1 my-2" {...props}>
                              {children}
                            </ol>
                          ),
                          li: ({ children, ...props }) => (
                            <li className="pl-1" {...props}>
                              {children}
                            </li>
                          ),
                          // Custom styling for paragraphs
                          p: ({ children, ...props }) => (
                            <p className="mb-2 last:mb-0" {...props}>
                              {children}
                            </p>
                          ),
                          // Custom styling for code blocks
                          code: ({ inline, children, ...props }) => (
                            inline ? (
                              <code className="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono" {...props}>
                                {children}
                              </code>
                            ) : (
                              <code className="block bg-gray-100 p-2 rounded text-sm font-mono overflow-x-auto my-2" {...props}>
                                {children}
                              </code>
                            )
                          ),
                          // Custom styling for blockquotes
                          blockquote: ({ children, ...props }) => (
                            <blockquote className="border-l-4 border-gray-300 pl-4 my-2 italic text-gray-600" {...props}>
                              {children}
                            </blockquote>
                          ),
                          // Custom styling for headings
                          h1: ({ children, ...props }) => (
                            <h1 className="text-lg font-bold mb-2 mt-4" {...props}>
                              {children}
                            </h1>
                          ),
                          h2: ({ children, ...props }) => (
                            <h2 className="text-base font-bold mb-2 mt-3" {...props}>
                              {children}
                            </h2>
                          ),
                          h3: ({ children, ...props }) => (
                            <h3 className="text-sm font-bold mb-2 mt-2" {...props}>
                              {children}
                            </h3>
                          ),
                        }}
                      >
                        {formatResponseText(message.content)}
                      </ReactMarkdown>
                    </div>
                  )}
                  <p className={`text-xs mt-2 md:mt-3 ${
                    message.role === 'user' ? 'text-green-100' : 'text-gray-400'
                  }`}>
                    {message.timestamp.toLocaleTimeString('id-ID', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </p>
                </div>
                
                {message.role === 'user' && (
                  <span className="text-xs text-gray-500 mt-1">You</span>
                )}
              </div>
            ))}
            
            {isLoading && (
              <div className="flex flex-col items-start">
                <span className="text-xs text-gray-500 mb-1">
                  {persona?.name || 'Attallah'}
                </span>
                <div className="bg-white text-gray-800 rounded-2xl rounded-bl-none px-4 md:px-5 py-3 md:py-4 border border-gray-100 shadow-sm">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                    <span className="text-sm text-gray-500">{t('chat.typing')}</span>
                  </div>
                </div>
              </div>
            )}
            
            {/* Invisible element for scrolling to bottom */}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
        
        {/* Fixed Input Area */}
        <div className="flex-shrink-0 border-t border-gray-200 bg-white px-4 py-3 md:p-4">
          <div className="flex gap-3 items-end">
            <Textarea
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyPress}
              placeholder={t('chat.inputPlaceholder')}
              disabled={isLoading}
              className="flex-1 border-gray-200 focus:border-green-400 focus:ring-green-400 rounded-2xl px-4 py-3 text-sm resize-none min-h-[60px] max-h-[120px]"
              rows={1}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!input.trim() || isLoading}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-4 md:px-6 py-3 rounded-full shadow-lg hover:shadow-xl h-[60px] flex-shrink-0"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex justify-between items-center mt-2">
            <div className="flex items-center gap-3">
              <p className="text-xs text-gray-400">
                {t('chat.sendInstructions')}
              </p>
              {storageAvailable && (
                <p className="text-xs text-gray-400">
                  💾 {messages.length > 1 ? 'Percakapan tersimpan' : 'Siap menyimpan'}
                </p>
              )}
            </div>
            <p className={`text-xs ${input.length > MAX_MESSAGE_LENGTH * 0.9 ? 'text-red-500' : 'text-gray-400'}`}>
              {t('chat.characterCount', { current: input.length, max: MAX_MESSAGE_LENGTH })}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}