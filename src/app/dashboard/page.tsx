'use client'

import StatsCards, { DetailedStats } from '@/components/dashboard/stats-cards'
import { ChatVolumeChart, TokenUsageChart, KnowledgeBaseChart, PerformanceChart } from '@/components/dashboard/charts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { RefreshCw, Download, Filter } from 'lucide-react'

export default function DashboardPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      {/* Header */}
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard</h2>
          <p className="text-muted-foreground">
            Real-time analytics and insights for your AI assistant
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Main Stats Cards */}
      <StatsCards />

      {/* Charts Grid */}
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-7">
        <ChatVolumeChart />
      </div>

      {/* Secondary Stats and Charts */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <TokenUsageChart />
        <KnowledgeBaseChart />
        <PerformanceChart />
      </div>

      {/* Detailed Stats */}
      <DetailedStats />

      {/* Recent Activity */}
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              {
                action: 'New documents added',
                count: 12,
                time: '2 hours ago',
                type: 'success'
              },
              {
                action: 'Knowledge base updated',
                count: 5,
                time: '4 hours ago',
                type: 'info'
              },
              {
                action: 'System maintenance',
                count: 1,
                time: '6 hours ago',
                type: 'warning'
              },
              {
                action: 'User reports processed',
                count: 8,
                time: '8 hours ago',
                type: 'default'
              }
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.type === 'success' ? 'bg-green-500' :
                    activity.type === 'warning' ? 'bg-yellow-500' :
                    activity.type === 'info' ? 'bg-blue-500' : 'bg-gray-500'
                  }`} />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
                <Badge variant="secondary">{activity.count}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">
              System Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              {
                service: 'AI Service',
                status: 'Operational',
                uptime: '99.9%',
                color: 'text-green-600'
              },
              {
                service: 'Knowledge Base',
                status: 'Operational',
                uptime: '99.8%',
                color: 'text-green-600'
              },
              {
                service: 'Database',
                status: 'Operational',
                uptime: '100%',
                color: 'text-green-600'
              },
              {
                service: 'API Gateway',
                status: 'Degraded',
                uptime: '98.5%',
                color: 'text-yellow-600'
              }
            ].map((service, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${
                    service.color === 'text-green-600' ? 'bg-green-500' : 'bg-yellow-500'
                  }`} />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{service.service}</p>
                    <p className="text-xs text-gray-500">{service.uptime} uptime</p>
                  </div>
                </div>
                <Badge variant={service.status === 'Operational' ? 'default' : 'secondary'}>
                  {service.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}