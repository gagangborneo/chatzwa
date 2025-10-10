'use client'

import { useState, useEffect } from 'react'
import { useI18n } from '@/lib/i18n'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import {
  Bot,
  MessageSquare,
  Palette,
  Volume2,
  Eye,
  Save,
  RotateCcw,
  Sparkles,
  Clock,
  Languages,
  Target,
  Heart
} from 'lucide-react'

export default function PersonaPage() {
  const { t } = useI18n()
  const [activeTab, setActiveTab] = useState('welcome')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  // State for persona settings
  const [aiName, setAiName] = useState('Attallah Assistant')
  const [welcomeMessage, setWelcomeMessage] = useState('Assalamualaikum! Saya adalah Attallah, asisten digital Yayasan Pendidikan Islam. Saya siap membantu Anda seputar informasi program pendidikan, transaksi, data, kajian, program donasi, dan ilmu Al-Quran. Ada yang bisa saya bantu? 🌟')

  const [textStyle, setTextStyle] = useState({
    formality: 'professional', // casual, professional, formal
    empathy: 'high', // low, medium, high
    enthusiasm: 'medium', // low, medium, high
    humor: 'low', // low, medium, high
    verbosity: 'medium' // concise, medium, detailed
  })

  const [responseSettings, setResponseSettings] = useState({
    maxLength: 500,
    minResponseTime: 1.0,
    maxResponseTime: 5.0,
    useEmojis: true,
    includeGreeting: true,
    askFollowUp: true
  })

  const [behaviorSettings, setBehaviorSettings] = useState({
    knowledgeDomain: 'islamic_education',
    languageStyle: 'friendly',
    culturalContext: 'indonesian',
    expertise: 'general',
    personality: 'helpful'
  })

  const saveSettings = async () => {
    setSaving(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    setSaving(false)
    setSaved(true)

    // Reset saved status after 3 seconds
    setTimeout(() => setSaved(false), 3000)
  }

  const resetSettings = () => {
    setAiName('Attallah Assistant')
    setWelcomeMessage('Assalamualaikum! Saya adalah Attallah, asisten digital Yayasan Pendidikan Islam. Saya siap membantu Anda seputar informasi program pendidikan, transaksi, data, kajian, program donasi, dan ilmu Al-Quran. Ada yang bisa saya bantu? 🌟')
    setTextStyle({
      formality: 'professional',
      empathy: 'high',
      enthusiasm: 'medium',
      humor: 'low',
      verbosity: 'medium'
    })
    setResponseSettings({
      maxLength: 500,
      minResponseTime: 1.0,
      maxResponseTime: 5.0,
      useEmojis: true,
      includeGreeting: true,
      askFollowUp: true
    })
    setBehaviorSettings({
      knowledgeDomain: 'islamic_education',
      languageStyle: 'friendly',
      culturalContext: 'indonesian',
      expertise: 'general',
      personality: 'helpful'
    })
  }

  const previewStyle = () => {
    const formalityLevels = {
      casual: ' Santai',
      professional: ' Profesional',
      formal: ' Formal'
    }

    const empathyLevels = {
      low: 'sedikit empati',
      medium: 'cukup empati',
      high: 'sangat empati'
    }

    const enthusiasmLevels = {
      low: 'tenang',
      medium: 'antusias',
      high: 'sangat antusias'
    }

    return `AI akan berbicara dengan gaya${formalityLevels[textStyle.formality]}, ${empathyLevels[textStyle.empathy]}, dan ${enthusiasmLevels[textStyle.enthusiasm]}`
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      {/* Header */}
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{t('persona.title')}</h2>
          <p className="text-muted-foreground">{t('persona.subtitle')}</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={resetSettings} className="flex items-center gap-2">
            <RotateCcw className="h-4 w-4" />
            {t('persona.reset')}
          </Button>
          <Button
            onClick={saveSettings}
            disabled={saving}
            className="flex items-center gap-2"
          >
            {saving ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                {t('persona.saving')}
              </>
            ) : saved ? (
              <>
                <div className="h-4 w-4 text-green-500">✓</div>
                {t('persona.saved')}
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                {t('persona.save')}
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Success Message */}
      {saved && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg flex items-center gap-2">
          <div className="h-4 w-4 text-green-600">✓</div>
          {t('persona.saveSuccess')}
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="welcome" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            {t('persona.welcomeTab')}
          </TabsTrigger>
          <TabsTrigger value="style" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            {t('persona.styleTab')}
          </TabsTrigger>
          <TabsTrigger value="behavior" className="flex items-center gap-2">
            <Bot className="h-4 w-4" />
            {t('persona.behaviorTab')}
          </TabsTrigger>
          <TabsTrigger value="advanced" className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            {t('persona.advancedTab')}
          </TabsTrigger>
        </TabsList>

        {/* Welcome Message Tab */}
        <TabsContent value="welcome" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  {t('persona.welcomeMessage')}
                </CardTitle>
                <CardDescription>{t('persona.welcomeDescription')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="ai-name">{t('persona.aiName')}</Label>
                  <Input
                    id="ai-name"
                    value={aiName}
                    onChange={(e) => setAiName(e.target.value)}
                    placeholder={t('persona.aiNamePlaceholder')}
                    maxLength={50}
                  />
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{t('persona.nameCharacterCount', { current: aiName.length, max: 50 })}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="welcome-message">{t('persona.messageText')}</Label>
                  <Textarea
                    id="welcome-message"
                    value={welcomeMessage}
                    onChange={(e) => setWelcomeMessage(e.target.value)}
                    placeholder={t('persona.welcomePlaceholder')}
                    className="min-h-[120px]"
                    maxLength={500}
                  />
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{t('persona.characterCount', { current: welcomeMessage.length, max: 500 })}</span>
                    <Button variant="outline" size="sm" onClick={() => setWelcomeMessage(welcomeMessage + ' 🌟')}>
                      {t('persona.addEmoji')}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>{t('persona.quickTemplates')}</Label>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setWelcomeMessage('Halo! Saya siap membantu Anda dengan informasi tentang program pendidikan dan layanan kami. Ada yang bisa saya bantu? 😊')}
                    >
                      {t('persona.templates.friendly')}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setWelcomeMessage('Selamat datang! Saya adalah asisten AI yang siap membantu dengan pertanyaan seputar pendidikan Islam dan layanan yayasan.')}
                    >
                      {t('persona.templates.professional')}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setWelcomeMessage('Assalamualaikum Warahmatullahi Wabarakatuh! Selamat datang di layanan digital Yayasan Pendidikan Islam. Semoga informasi yang saya berikan bermanfaat untuk Anda. 🕌')}
                    >
                      {t('persona.templates.islamic')}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  {t('persona.preview')}
                </CardTitle>
                <CardDescription>{t('persona.previewDescription')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-slate-50 rounded-lg p-4 border">
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-green-600 to-emerald-600 flex items-center justify-center flex-shrink-0">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm text-green-700 mb-1">{aiName}</div>
                      <div className="text-sm text-slate-700 leading-relaxed">{welcomeMessage}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Text Style Tab */}
        <TabsContent value="style" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  {t('persona.textStyle')}
                </CardTitle>
                <CardDescription>{t('persona.textStyleDescription')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>{t('persona.formality')}</Label>
                  <Select value={textStyle.formality} onValueChange={(value: 'casual' | 'professional' | 'formal') => setTextStyle({...textStyle, formality: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="casual">{t('persona.formality.casual')}</SelectItem>
                      <SelectItem value="professional">{t('persona.formality.professional')}</SelectItem>
                      <SelectItem value="formal">{t('persona.formality.formal')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>{t('persona.empathy')}</Label>
                  <Select value={textStyle.empathy} onValueChange={(value: 'low' | 'medium' | 'high') => setTextStyle({...textStyle, empathy: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">{t('persona.empathy.low')}</SelectItem>
                      <SelectItem value="medium">{t('persona.empathy.medium')}</SelectItem>
                      <SelectItem value="high">{t('persona.empathy.high')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>{t('persona.enthusiasm')}</Label>
                  <Select value={textStyle.enthusiasm} onValueChange={(value: 'low' | 'medium' | 'high') => setTextStyle({...textStyle, enthusiasm: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">{t('persona.enthusiasm.low')}</SelectItem>
                      <SelectItem value="medium">{t('persona.enthusiasm.medium')}</SelectItem>
                      <SelectItem value="high">{t('persona.enthusiasm.high')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>{t('persona.humor')}</Label>
                  <Select value={textStyle.humor} onValueChange={(value: 'low' | 'medium' | 'high') => setTextStyle({...textStyle, humor: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">{t('persona.humor.low')}</SelectItem>
                      <SelectItem value="medium">{t('persona.humor.medium')}</SelectItem>
                      <SelectItem value="high">{t('persona.humor.high')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>{t('persona.verbosity')}</Label>
                  <Select value={textStyle.verbosity} onValueChange={(value: 'concise' | 'medium' | 'detailed') => setTextStyle({...textStyle, verbosity: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="concise">{t('persona.verbosity.concise')}</SelectItem>
                      <SelectItem value="medium">{t('persona.verbosity.medium')}</SelectItem>
                      <SelectItem value="detailed">{t('persona.verbosity.detailed')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  {t('persona.styleSummary')}
                </CardTitle>
                <CardDescription>{t('persona.styleSummaryDescription')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{t('persona.currentStyle')}</span>
                    <Badge variant="secondary">{previewStyle()}</Badge>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Heart className="h-4 w-4 text-red-500" />
                        <span>{t('persona.empathy')}:</span>
                        <Badge variant="outline">{t(`persona.empathy.${textStyle.empathy}`)}</Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Volume2 className="h-4 w-4 text-blue-500" />
                        <span>{t('persona.enthusiasm')}:</span>
                        <Badge variant="outline">{t(`persona.enthusiasm.${textStyle.enthusiasm}`)}</Badge>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-yellow-500" />
                        <span>{t('persona.humor')}:</span>
                        <Badge variant="outline">{t(`persona.humor.${textStyle.humor}`)}</Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Languages className="h-4 w-4 text-green-500" />
                        <span>{t('persona.formality')}:</span>
                        <Badge variant="outline">{t(`persona.formality.${textStyle.formality}`)}</Badge>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-lg">
                  <div className="text-sm font-medium mb-1">{t('persona.tip')}</div>
                  <div className="text-sm">{t('persona.styleTip')}</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Behavior Tab */}
        <TabsContent value="behavior" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bot className="h-5 w-5" />
                  {t('persona.behaviorSettings')}
                </CardTitle>
                <CardDescription>{t('persona.behaviorDescription')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>{t('persona.knowledgeDomain')}</Label>
                  <Select value={behaviorSettings.knowledgeDomain} onValueChange={(value) => setBehaviorSettings({...behaviorSettings, knowledgeDomain: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="islamic_education">{t('persona.domains.islamicEducation')}</SelectItem>
                      <SelectItem value="general">{t('persona.domains.general')}</SelectItem>
                      <SelectItem value="education">{t('persona.domains.education')}</SelectItem>
                      <SelectItem value="religious">{t('persona.domains.religious')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>{t('persona.languageStyle')}</Label>
                  <Select value={behaviorSettings.languageStyle} onValueChange={(value) => setBehaviorSettings({...behaviorSettings, languageStyle: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="friendly">{t('persona.languageStyles.friendly')}</SelectItem>
                      <SelectItem value="professional">{t('persona.languageStyles.professional')}</SelectItem>
                      <SelectItem value="academic">{t('persona.languageStyles.academic')}</SelectItem>
                      <SelectItem value="casual">{t('persona.languageStyles.casual')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>{t('persona.culturalContext')}</Label>
                  <Select value={behaviorSettings.culturalContext} onValueChange={(value) => setBehaviorSettings({...behaviorSettings, culturalContext: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="indonesian">{t('persona.contexts.indonesian')}</SelectItem>
                      <SelectItem value="islamic">{t('persona.contexts.islamic')}</SelectItem>
                      <SelectItem value="western">{t('persona.contexts.western')}</SelectItem>
                      <SelectItem value="neutral">{t('persona.contexts.neutral')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>{t('persona.expertise')}</Label>
                  <Select value={behaviorSettings.expertise} onValueChange={(value) => setBehaviorSettings({...behaviorSettings, expertise: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">{t('persona.expertiseLevels.general')}</SelectItem>
                      <SelectItem value="intermediate">{t('persona.expertiseLevels.intermediate')}</SelectItem>
                      <SelectItem value="expert">{t('persona.expertiseLevels.expert')}</SelectItem>
                      <SelectItem value="scholar">{t('persona.expertiseLevels.scholar')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>{t('persona.personality')}</Label>
                  <Select value={behaviorSettings.personality} onValueChange={(value) => setBehaviorSettings({...behaviorSettings, personality: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="helpful">{t('persona.personalities.helpful')}</SelectItem>
                      <SelectItem value="formal">{t('persona.personalities.formal')}</SelectItem>
                      <SelectItem value="friendly">{t('persona.personalities.friendly')}</SelectItem>
                      <SelectItem value="teacher">{t('persona.personalities.teacher')}</SelectItem>
                      <SelectItem value="guide">{t('persona.personalities.guide')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  {t('persona.responseSettings')}
                </CardTitle>
                <CardDescription>{t('persona.responseDescription')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>{t('persona.maxLength')}</Label>
                    <span className="text-sm text-muted-foreground">{responseSettings.maxLength} {t('persona.characters')}</span>
                  </div>
                  <Slider
                    value={[responseSettings.maxLength]}
                    onValueChange={(value) => setResponseSettings({...responseSettings, maxLength: value[0]})}
                    max={1000}
                    min={100}
                    step={50}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>{t('persona.minResponseTime')}</Label>
                    <span className="text-sm text-muted-foreground">{responseSettings.minResponseTime}s</span>
                  </div>
                  <Slider
                    value={[responseSettings.minResponseTime]}
                    onValueChange={(value) => setResponseSettings({...responseSettings, minResponseTime: value[0]})}
                    max={5}
                    min={0.5}
                    step={0.5}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>{t('persona.maxResponseTime')}</Label>
                    <span className="text-sm text-muted-foreground">{responseSettings.maxResponseTime}s</span>
                  </div>
                  <Slider
                    value={[responseSettings.maxResponseTime]}
                    onValueChange={(value) => setResponseSettings({...responseSettings, maxResponseTime: value[0]})}
                    max={10}
                    min={1}
                    step={0.5}
                    className="w-full"
                  />
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="use-emojis">{t('persona.useEmojis')}</Label>
                    <Switch
                      id="use-emojis"
                      checked={responseSettings.useEmojis}
                      onCheckedChange={(checked) => setResponseSettings({...responseSettings, useEmojis: checked})}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="include-greeting">{t('persona.includeGreeting')}</Label>
                    <Switch
                      id="include-greeting"
                      checked={responseSettings.includeGreeting}
                      onCheckedChange={(checked) => setResponseSettings({...responseSettings, includeGreeting: checked})}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="ask-followup">{t('persona.askFollowUp')}</Label>
                    <Switch
                      id="ask-followup"
                      checked={responseSettings.askFollowUp}
                      onCheckedChange={(checked) => setResponseSettings({...responseSettings, askFollowUp: checked})}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Advanced Tab */}
        <TabsContent value="advanced" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                {t('persona.advancedSettings')}
              </CardTitle>
              <CardDescription>{t('persona.advancedDescription')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">{t('persona.responsePatterns')}</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>{t('persona.useContext')}</Label>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>{t('persona.adaptiveResponses')}</Label>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>{t('persona.personalizedAnswers')}</Label>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>{t('persona.proactiveHelp')}</Label>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">{t('persona.safetySettings')}</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>{t('persona.contentFilter')}</Label>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>{t('persona.respectfulLanguage')}</Label>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>{t('persona.islamicValues')}</Label>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>{t('persona.privacyMode')}</Label>
                      <Switch />
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">{t('persona.customInstructions')}</h3>
                <Textarea
                  placeholder={t('persona.customInstructionsPlaceholder')}
                  className="min-h-[100px]"
                />
                <p className="text-sm text-muted-foreground">
                  {t('persona.customInstructionsHelp')}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}