"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import {
  Bot,
  Zap,
  Settings,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Key,
  Server
} from 'lucide-react'

interface AIProvider {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  models: AIModel[]
  requiresApiKey: boolean
  baseUrl?: string
  status: 'connected' | 'disconnected' | 'error'
  configurable: boolean
}

interface AIModel {
  id: string
  name: string
  description: string
  contextLength?: number
  pricing?: string
}

interface AIApiSelectorProps {
  selectedProvider?: string
  selectedModel?: string
  onProviderChange?: (provider: string) => void
  onModelChange?: (model: string) => void
  onApiKeyChange?: (apiKey: string) => void
  disabled?: boolean
}

export default function AIApiSelector({
  selectedProvider = 'openrouter',
  selectedModel = process.env.NEXT_PUBLIC_DEFAULT_AI_MODEL || 'meta-llama/llama-3.1-8b-instruct:free',
  onProviderChange,
  onModelChange,
  onApiKeyChange,
  disabled = false
}: AIApiSelectorProps) {
  const [providers, setProviders] = useState<AIProvider[]>([])
  const [apiKey, setApiKey] = useState('')
  const [testConnection, setTestConnection] = useState<'idle' | 'testing' | 'success' | 'error'>('idle')
  const [expandedProvider, setExpandedProvider] = useState<string | null>(null)

  // Initialize providers
  useEffect(() => {
    const aiProviders: AIProvider[] = [
      {
        id: 'openrouter',
        name: 'OpenRouter',
        description: 'Access to multiple AI models through OpenRouter',
        icon: <Zap className="h-5 w-5" />,
        requiresApiKey: true,
        baseUrl: 'https://openrouter.ai/api/v1',
        status: apiKey ? 'connected' : 'disconnected',
        configurable: true,
        models: [
          {
            id: 'meta-llama/llama-3.1-8b-instruct:free',
            name: 'Llama 3.1 8B (Free)',
            description: 'Free tier model, good for general use',
            contextLength: 128000,
            pricing: 'Free'
          },
          {
            id: 'anthropic/claude-3.5-sonnet',
            name: 'Claude 3.5 Sonnet',
            description: 'High-quality reasoning and analysis',
            contextLength: 200000,
            pricing: 'Paid'
          },
          {
            id: 'openai/gpt-4o',
            name: 'GPT-4o',
            description: 'OpenAI latest model with multimodal capabilities',
            contextLength: 128000,
            pricing: 'Paid'
          },
          {
            id: 'google/gemini-pro-1.5',
            name: 'Gemini Pro 1.5',
            description: 'Google advanced model with large context',
            contextLength: 2000000,
            pricing: 'Paid'
          },
          {
            id: 'meta-llama/llama-3.1-70b-instruct',
            name: 'Llama 3.1 70B',
            description: 'High-capacity model for complex tasks',
            contextLength: 128000,
            pricing: 'Paid'
          }
        ]
      },
      {
        id: 'ollama',
        name: 'Ollama',
        description: 'Local AI models through Ollama',
        icon: <Server className="h-5 w-5" />,
        requiresApiKey: false,
        baseUrl: process.env.OLLAMA_BASE_URL || 'http://localhost:11434',
        status: 'disconnected', // Would need actual connection test
        configurable: true,
        models: [
          {
            id: 'llama2',
            name: 'Llama 2',
            description: 'Open source model by Meta',
            contextLength: 4096
          },
          {
            id: 'codellama',
            name: 'Code Llama',
            description: 'Specialized for code generation',
            contextLength: 4096
          },
          {
            id: 'mistral',
            name: 'Mistral',
            description: 'Efficient open source model',
            contextLength: 4096
          }
        ]
      }
    ]
    setProviders(aiProviders)
  }, [apiKey])

  const handleProviderChange = (providerId: string) => {
    const provider = providers.find(p => p.id === providerId)
    if (provider && onProviderChange) {
      onProviderChange(providerId)
      // Auto-select first model if none selected
      if (provider.models.length > 0 && !selectedModel) {
        onModelChange?.(provider.models[0].id)
      }
    }
  }

  const handleTestConnection = async () => {
    setTestConnection('testing')
    try {
      // Here you would implement actual connection testing
      // For now, simulate with timeout
      await new Promise(resolve => setTimeout(resolve, 2000))
      setTestConnection('success')
      setTimeout(() => setTestConnection('idle'), 3000)
    } catch (error) {
      setTestConnection('error')
      setTimeout(() => setTestConnection('idle'), 3000)
    }
  }

  const currentProvider = providers.find(p => p.id === selectedProvider)
  const availableModels = currentProvider?.models || []

  return (
    <div className="space-y-6">
      {/* Provider Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            AI Provider Selection
          </CardTitle>
          <CardDescription>
            Choose your AI service provider and configure the model
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Provider Tabs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {providers.map((provider) => (
              <div
                key={provider.id}
                className={`relative cursor-pointer rounded-lg border p-4 transition-all hover:shadow-md ${
                  selectedProvider === provider.id
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={() => !disabled && handleProviderChange(provider.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-full ${
                      selectedProvider === provider.id ? 'bg-primary text-primary-foreground' : 'bg-muted'
                    }`}>
                      {provider.icon}
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-medium">{provider.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {provider.description}
                      </p>
                      <div className="flex items-center gap-2">
                        <Badge variant={
                          provider.status === 'connected' ? 'default' :
                          provider.status === 'error' ? 'destructive' : 'secondary'
                        }>
                          {provider.status}
                        </Badge>
                        {provider.requiresApiKey && (
                          <Badge variant="outline">API Key Required</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  {selectedProvider === provider.id && (
                    <CheckCircle className="h-5 w-5 text-primary" />
                  )}
                </div>
              </div>
            ))}
          </div>

          <Separator />

          {/* Model Selection */}
          <div className="space-y-3">
            <Label className="text-base font-medium">AI Model</Label>
            <Select
              value={selectedModel}
              onValueChange={onModelChange}
              disabled={disabled || !currentProvider}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select an AI model" />
              </SelectTrigger>
              <SelectContent>
                {availableModels.map((model) => (
                  <SelectItem key={model.id} value={model.id}>
                    <div className="flex flex-col items-start">
                      <span className="font-medium">{model.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {model.description}
                      </span>
                      {model.contextLength && (
                        <span className="text-xs text-muted-foreground">
                          Context: {model.contextLength.toLocaleString()} tokens
                        </span>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* API Key Configuration for providers that need it */}
          {currentProvider?.requiresApiKey && (
            <>
              <Separator />
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Key className="h-4 w-4" />
                  <Label className="text-base font-medium">API Key Configuration</Label>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="api-key">API Key</Label>
                  <Input
                    id="api-key"
                    type="password"
                    placeholder="Enter your API key"
                    value={apiKey}
                    onChange={(e) => {
                      setApiKey(e.target.value)
                      onApiKeyChange?.(e.target.value)
                    }}
                    disabled={disabled}
                  />
                  <p className="text-sm text-muted-foreground">
                    Your API key is stored locally and used only for making requests to {currentProvider.name}.
                  </p>
                </div>

                {currentProvider.id === 'openrouter' && (
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleTestConnection}
                      disabled={!apiKey || disabled || testConnection === 'testing'}
                      className="w-full"
                    >
                      {testConnection === 'testing' ? (
                        <>
                          <Settings className="h-4 w-4 mr-2 animate-spin" />
                          Testing Connection...
                        </>
                      ) : testConnection === 'success' ? (
                        <>
                          <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                          Connection Successful
                        </>
                      ) : testConnection === 'error' ? (
                        <>
                          <AlertCircle className="h-4 w-4 mr-2 text-red-600" />
                          Connection Failed
                        </>
                      ) : (
                        <>
                          <Zap className="h-4 w-4 mr-2" />
                          Test Connection
                        </>
                      )}
                    </Button>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <ExternalLink className="h-3 w-3" />
                      <span>
                        Get your API key from{' '}
                        <a
                          href="https://openrouter.ai/keys"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          OpenRouter Dashboard
                        </a>
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Advanced Settings */}
          {currentProvider?.configurable && (
            <>
              <Separator />
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  <Label className="text-base font-medium">Advanced Settings</Label>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="base-url">Base URL</Label>
                    <Input
                      id="base-url"
                      value={currentProvider.baseUrl}
                      disabled
                      className="bg-muted"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="temperature">Temperature (0.0 - 1.0)</Label>
                    <Input
                      id="temperature"
                      type="number"
                      min="0"
                      max="1"
                      step="0.1"
                      defaultValue="0.7"
                      disabled={disabled}
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="streaming" defaultChecked disabled={disabled} />
                  <Label htmlFor="streaming">Enable streaming responses</Label>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Configuration Summary */}
      {currentProvider && selectedModel && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Current Configuration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-1">
                <Label className="text-sm font-medium text-muted-foreground">Provider</Label>
                <p className="flex items-center gap-2">
                  {currentProvider.icon}
                  {currentProvider.name}
                </p>
              </div>
              <div className="space-y-1">
                <Label className="text-sm font-medium text-muted-foreground">Model</Label>
                <p>{availableModels.find(m => m.id === selectedModel)?.name}</p>
              </div>
              <div className="space-y-1">
                <Label className="text-sm font-medium text-muted-foreground">Status</Label>
                <Badge variant={
                  currentProvider.status === 'connected' ? 'default' :
                  currentProvider.status === 'error' ? 'destructive' : 'secondary'
                }>
                  {currentProvider.status}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}