import { Card, CardContent, CardHeader } from '@/components/ui/card'

export default function AdminDashboardLoading() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between space-y-2">
        <div className="space-y-2">
          <div className="h-8 w-48 bg-muted animate-pulse rounded"></div>
          <div className="h-4 w-96 bg-muted animate-pulse rounded"></div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="h-9 w-20 bg-muted animate-pulse rounded"></div>
          <div className="h-9 w-20 bg-muted animate-pulse rounded"></div>
          <div className="h-9 w-24 bg-muted animate-pulse rounded"></div>
        </div>
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 w-20 bg-muted animate-pulse rounded"></div>
              <div className="h-4 w-4 bg-muted animate-pulse rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 w-16 bg-muted animate-pulse rounded mb-2"></div>
              <div className="h-3 w-24 bg-muted animate-pulse rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Skeleton */}
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        {[...Array(2)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <div className="h-6 w-40 bg-muted animate-pulse rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="h-[200px] bg-muted animate-pulse rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Secondary Stats Skeleton */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <div className="h-6 w-32 bg-muted animate-pulse rounded"></div>
            </CardHeader>
            <CardContent className="space-y-4">
              {[...Array(4)].map((_, j) => (
                <div key={j} className="flex items-center justify-between">
                  <div className="h-4 w-24 bg-muted animate-pulse rounded"></div>
                  <div className="h-6 w-16 bg-muted animate-pulse rounded"></div>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* System Status Skeleton */}
      <Card>
        <CardHeader>
          <div className="h-6 w-48 bg-muted animate-pulse rounded"></div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="p-4 bg-muted animate-pulse rounded-lg">
                <div className="h-4 w-32 bg-muted animate-pulse rounded mb-2"></div>
                <div className="space-y-2">
                  <div className="h-3 w-20 bg-muted animate-pulse rounded"></div>
                  <div className="h-3 w-16 bg-muted animate-pulse rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}