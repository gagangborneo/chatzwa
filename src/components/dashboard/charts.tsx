'use client'

import { useI18n } from '@/lib/i18n'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell } from 'recharts'

const chatVolumeData = [
  { name: 'Mon', chats: 120, tokens: 45000 },
  { name: 'Tue', chats: 145, tokens: 52000 },
  { name: 'Wed', chats: 180, tokens: 61000 },
  { name: 'Thu', chats: 165, tokens: 58000 },
  { name: 'Fri', chats: 210, tokens: 72000 },
  { name: 'Sat', chats: 190, tokens: 65000 },
  { name: 'Sun', chats: 225, tokens: 78000 },
]

const tokenUsageData = [
  { name: 'Week 1', usage: 1.2, cost: 45 },
  { name: 'Week 2', usage: 1.5, cost: 56 },
  { name: 'Week 3', usage: 1.8, cost: 68 },
  { name: 'Week 4', usage: 2.3, cost: 87 },
]

export function getKnowledgeBaseData(t: (key: string) => string) {
  return [
    { name: t('knowledge.islamicStudies'), value: 245, color: '#10b981' },
    { name: t('knowledge.education'), value: 189, color: '#3b82f6' },
    { name: t('knowledge.donationPrograms'), value: 156, color: '#8b5cf6' },
    { name: t('knowledge.quranLearning'), value: 134, color: '#f59e0b' },
    { name: t('knowledge.general'), value: 123, color: '#6b7280' },
  ]
}

const performanceData = [
  { time: '00:00', responseTime: 1.2, accuracy: 94 },
  { time: '04:00', responseTime: 1.0, accuracy: 95 },
  { time: '08:00', responseTime: 1.4, accuracy: 92 },
  { time: '12:00', responseTime: 1.8, accuracy: 90 },
  { time: '16:00', responseTime: 1.6, accuracy: 91 },
  { time: '20:00', responseTime: 1.3, accuracy: 93 },
]

export function ChatVolumeChart() {
  const { t } = useI18n()

  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">
          {t('charts.chatVolumeToken')}
        </CardTitle>
      </CardHeader>
      <CardContent className="pl-2">
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chatVolumeData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="name"
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
            />
            <YAxis
              yAxisId="left"
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px'
              }}
            />
            <Area
              yAxisId="left"
              type="monotone"
              dataKey="chats"
              stroke="#3b82f6"
              fill="#3b82f6"
              fillOpacity={0.2}
              strokeWidth={2}
            />
            <Area
              yAxisId="right"
              type="monotone"
              dataKey="tokens"
              stroke="#10b981"
              fill="#10b981"
              fillOpacity={0.1}
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

export function TokenUsageChart() {
  const { t } = useI18n()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">
          {t('charts.tokenUsageTrend')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={tokenUsageData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="name"
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
            />
            <YAxis
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px'
              }}
            />
            <Bar
              dataKey="usage"
              fill="#8b5cf6"
              radius={[8, 8, 0, 0]}
            />
            <Bar
              dataKey="cost"
              fill="#f59e0b"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

export function KnowledgeBaseChart() {
  const { t } = useI18n()
  const knowledgeBaseData = getKnowledgeBaseData(t)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">
          {t('charts.knowledgeBaseDistribution')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={knowledgeBaseData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {knowledgeBaseData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px'
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

export function PerformanceChart() {
  const { t } = useI18n()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">
          {t('charts.performanceMetrics')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={performanceData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="time"
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
            />
            <YAxis
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px'
              }}
            />
            <Line
              type="monotone"
              dataKey="responseTime"
              stroke="#ef4444"
              strokeWidth={2}
              dot={{ fill: '#ef4444', r: 4 }}
              name="Response Time (s)"
            />
            <Line
              type="monotone"
              dataKey="accuracy"
              stroke="#10b981"
              strokeWidth={2}
              dot={{ fill: '#10b981', r: 4 }}
              name="Accuracy (%)"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}