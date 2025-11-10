'use client'

import { useI18n } from '@/lib/i18n'
import { motion } from 'framer-motion'
import {
  MessageSquare,
  Database,
  TrendingUp,
  Users,
  FileText,
  Cpu,
  ArrowUp,
  ArrowDown,
  Minus
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface StatCardProps {
  title: string
  value: string | number
  description: string
  icon: React.ComponentType<{ className?: string }>
  trend?: 'up' | 'down' | 'neutral'
  trendValue?: string
  iconColor?: string
  bgColor?: string
}

function StatCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  trendValue,
  iconColor = "text-slate-600",
  bgColor = "bg-slate-50"
}: StatCardProps) {
  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <ArrowUp className="h-4 w-4 text-green-600" />
      case 'down':
        return <ArrowDown className="h-4 w-4 text-red-600" />
      default:
        return <Minus className="h-4 w-4 text-gray-400" />
    }
  }

  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return 'text-green-600'
      case 'down':
        return 'text-red-600'
      default:
        return 'text-gray-400'
    }
  }

  return (
    <motion.div
      whileHover={{
        scale: 1.02,
        boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)"
      }}
      transition={{ duration: 0.2 }}
    >
      <Card className="hover:shadow-lg transition-all duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">
            {title}
          </CardTitle>
          <motion.div
            className={`p-2 rounded-lg ${bgColor}`}
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ duration: 0.2 }}
          >
            <Icon className={`h-4 w-4 ${iconColor}`} />
          </motion.div>
        </CardHeader>
        <CardContent>
          <motion.div
            className="text-2xl font-bold text-gray-900"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {value}
          </motion.div>
          <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
            <span>{description}</span>
            {trend && trendValue && (
              <motion.span
                className="flex items-center gap-1 ml-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.3 }}
              >
                {getTrendIcon()}
                <span className={getTrendColor()}>{trendValue}</span>
              </motion.span>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default function StatsCards() {
  const { t } = useI18n()

  const cards = [
    {
      title: t('stats.totalChats'),
      value: "1,234",
      description: t('stats.conversationsMonth'),
      icon: MessageSquare,
      trend: "up" as const,
      trendValue: "12% from last month",
      iconColor: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: t('stats.knowledgeBase'),
      value: "847",
      description: t('stats.documentsIndexed'),
      icon: Database,
      trend: "up" as const,
      trendValue: "8% this week",
      iconColor: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      title: t('stats.tokenUsage'),
      value: "2.3M",
      description: t('stats.tokensProcessed'),
      icon: TrendingUp,
      trend: "up" as const,
      trendValue: "23% from last week",
      iconColor: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: t('stats.activeUsers'),
      value: "428",
      description: t('stats.uniqueUsersToday'),
      icon: Users,
      trend: "neutral" as const,
      trendValue: "Same as yesterday",
      iconColor: "text-orange-600",
      bgColor: "bg-orange-50"
    }
  ]

  return (
    <motion.div
      className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {cards.map((card, index) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.5 }}
        >
          <StatCard
            title={card.title}
            value={card.value}
            description={card.description}
            icon={card.icon}
            trend={card.trend}
            trendValue={card.trendValue}
            iconColor={card.iconColor}
            bgColor={card.bgColor}
          />
        </motion.div>
      ))}
    </motion.div>
  )
}

export function DetailedStats() {
  const { t } = useI18n()

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-6">
      <StatCard
        title={t('stats.avgResponseTime')}
        value="1.2s"
        description={t('stats.avgAiResponse')}
        icon={Cpu}
        trend="down"
        trendValue="0.3s improvement"
        iconColor="text-indigo-600"
        bgColor="bg-indigo-50"
      />

      <StatCard
        title={t('stats.documentsProcessed')}
        value="156"
        description={t('stats.newDocumentsWeek')}
        icon={FileText}
        trend="up"
        trendValue="45% increase"
        iconColor="text-teal-600"
        bgColor="bg-teal-50"
      />

      <StatCard
        title={t('stats.systemHealth')}
        value="99.9%"
        description={t('stats.uptimeMonth')}
        icon={TrendingUp}
        trend="neutral"
        trendValue="Excellent"
        iconColor="text-emerald-600"
        bgColor="bg-emerald-50"
      />
    </div>
  )
}