'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { RefreshCw, Download, Filter, Users, Bot, CreditCard, AlertTriangle, TrendingUp, Shield } from 'lucide-react'

export default function AdminDashboardPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      {/* Header */}
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">Admin Dashboard</h2>
          <p className="text-muted-foreground">
            System administration and management overview
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

      {/* Admin Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active AI Models</CardTitle>
            <Bot className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">
              2 models updating
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$45,678</div>
            <p className="text-xs text-muted-foreground">
              +23% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Health</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">98.5%</div>
            <p className="text-xs text-muted-foreground">
              All systems operational
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">
              User Registration Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center text-gray-500">
                <TrendingUp className="h-8 w-8 mx-auto mb-2" />
                <p className="text-sm">User growth chart will be displayed here</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">
              AI Model Usage Statistics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center text-gray-500">
                <Bot className="h-8 w-8 mx-auto mb-2" />
                <p className="text-sm">AI model usage chart will be displayed here</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Stats */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">
              System Resources
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { resource: 'CPU Usage', value: '45%', status: 'normal' },
              { resource: 'Memory', value: '6.2GB / 16GB', status: 'normal' },
              { resource: 'Storage', value: '124GB / 500GB', status: 'normal' },
              { resource: 'Network', value: '2.4 Mbps', status: 'normal' }
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{item.resource}</span>
                <Badge variant="secondary">{item.value}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">
              Recent Activities
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              {
                action: 'New user registration',
                count: 23,
                time: '5 min ago',
                type: 'success'
              },
              {
                action: 'AI model updated',
                count: 1,
                time: '1 hour ago',
                type: 'info'
              },
              {
                action: 'System backup completed',
                count: 1,
                time: '2 hours ago',
                type: 'success'
              },
              {
                action: 'Failed login attempts',
                count: 5,
                time: '3 hours ago',
                type: 'warning'
              }
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.type === 'success' ? 'bg-green-500' :
                    activity.type === 'warning' ? 'bg-yellow-500' :
                    'bg-blue-500'
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
              Security Alerts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              {
                alert: 'Suspicious login activity',
                severity: 'high',
                count: 3,
                time: '30 min ago'
              },
              {
                alert: 'Unusual API usage',
                severity: 'medium',
                count: 12,
                time: '2 hours ago'
              },
              {
                alert: 'Outdated dependencies',
                severity: 'low',
                count: 5,
                time: '1 day ago'
              }
            ].map((alert, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                <AlertTriangle className={`h-4 w-4 mt-0.5 ${
                  alert.severity === 'high' ? 'text-red-500' :
                  alert.severity === 'medium' ? 'text-yellow-500' :
                  'text-gray-500'
                }`} />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{alert.alert}</p>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-xs text-gray-500">{alert.time}</p>
                    <Badge variant={
                      alert.severity === 'high' ? 'destructive' :
                      alert.severity === 'medium' ? 'secondary' :
                      'outline'
                    }>
                      {alert.severity}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* System Status Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">
            System Services Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                service: 'Authentication Service',
                status: 'Operational',
                uptime: '99.9%',
                responseTime: '45ms',
                color: 'text-green-600'
              },
              {
                service: 'AI Model Service',
                status: 'Operational',
                uptime: '99.7%',
                responseTime: '120ms',
                color: 'text-green-600'
              },
              {
                service: 'Database Service',
                status: 'Operational',
                uptime: '100%',
                responseTime: '12ms',
                color: 'text-green-600'
              },
              {
                service: 'File Storage',
                status: 'Maintenance',
                uptime: '95.2%',
                responseTime: '230ms',
                color: 'text-yellow-600'
              },
              {
                service: 'API Gateway',
                status: 'Operational',
                uptime: '99.8%',
                responseTime: '28ms',
                color: 'text-green-600'
              },
              {
                service: 'Cache Service',
                status: 'Operational',
                uptime: '99.9%',
                responseTime: '5ms',
                color: 'text-green-600'
              },
              {
                service: 'Email Service',
                status: 'Degraded',
                uptime: '97.5%',
                responseTime: '450ms',
                color: 'text-yellow-600'
              },
              {
                service: 'Monitoring Service',
                status: 'Operational',
                uptime: '100%',
                responseTime: '15ms',
                color: 'text-green-600'
              }
            ].map((service, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${
                      service.color === 'text-green-600' ? 'bg-green-500' : 'bg-yellow-500'
                    }`} />
                    <h4 className="text-sm font-medium text-gray-900">{service.service}</h4>
                  </div>
                  <Badge variant={
                    service.status === 'Operational' ? 'default' :
                    service.status === 'Maintenance' ? 'secondary' :
                    'outline'
                  }>
                    {service.status}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Uptime:</span>
                    <span className="text-gray-700">{service.uptime}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Response:</span>
                    <span className="text-gray-700">{service.responseTime}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}