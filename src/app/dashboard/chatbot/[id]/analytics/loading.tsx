export default function AnalyticsLoading() {
  return (
    <div className="p-6 space-y-6">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div>
          <div className="h-8 w-32 bg-muted rounded animate-pulse mb-2"></div>
          <div className="h-4 w-64 bg-muted rounded animate-pulse"></div>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-10 w-[180px] bg-muted rounded animate-pulse"></div>
          <div className="h-10 w-[80px] bg-muted rounded animate-pulse"></div>
          <div className="h-10 w-[100px] bg-muted rounded animate-pulse"></div>
        </div>
      </div>

      {/* Overview Cards Skeleton */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="p-6 border rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="h-4 w-24 bg-muted rounded animate-pulse"></div>
              <div className="h-4 w-4 bg-muted rounded animate-pulse"></div>
            </div>
            <div className="h-8 w-20 bg-muted rounded animate-pulse mb-2"></div>
            <div className="h-3 w-32 bg-muted rounded animate-pulse"></div>
          </div>
        ))}
      </div>

      {/* Charts and Detailed Stats Skeleton */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Conversations Trend Skeleton */}
        <div className="p-6 border rounded-lg">
          <div className="mb-6">
            <div className="h-6 w-32 bg-muted rounded animate-pulse mb-2"></div>
            <div className="h-4 w-48 bg-muted rounded animate-pulse"></div>
          </div>
          <div className="space-y-4">
            {[...Array(7)].map((_, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 bg-muted rounded animate-pulse"></div>
                  <div className="h-4 w-24 bg-muted rounded animate-pulse"></div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="h-4 w-16 bg-muted rounded animate-pulse mb-1"></div>
                    <div className="h-3 w-14 bg-muted rounded animate-pulse"></div>
                  </div>
                  <div className="w-20 bg-muted rounded-full h-2">
                    <div className="h-2 rounded-full animate-pulse" style={{width: '60%'}}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Questions Skeleton */}
        <div className="p-6 border rounded-lg">
          <div className="mb-6">
            <div className="h-6 w-40 bg-muted rounded animate-pulse mb-2"></div>
            <div className="h-4 w-56 bg-muted rounded animate-pulse"></div>
          </div>
          <div className="space-y-4">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="h-4 w-48 bg-muted rounded animate-pulse mb-2"></div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-12 bg-muted rounded animate-pulse"></div>
                    <div className="h-5 w-16 bg-muted rounded animate-pulse"></div>
                  </div>
                </div>
                <div className="w-16 bg-muted rounded-full h-2 ml-4">
                  <div className="h-2 rounded-full animate-pulse" style={{width: '70%'}}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Performance Metrics Skeleton */}
        <div className="p-6 border rounded-lg">
          <div className="mb-6">
            <div className="h-6 w-36 bg-muted rounded animate-pulse mb-2"></div>
            <div className="h-4 w-44 bg-muted rounded animate-pulse"></div>
          </div>
          <div className="space-y-4">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 bg-muted rounded animate-pulse"></div>
                  <div className="h-4 w-32 bg-muted rounded animate-pulse"></div>
                </div>
                <div className="h-4 w-12 bg-muted rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>

        {/* User Engagement Skeleton */}
        <div className="p-6 border rounded-lg">
          <div className="mb-6">
            <div className="h-6 w-40 bg-muted rounded animate-pulse mb-2"></div>
            <div className="h-4 w-48 bg-muted rounded animate-pulse"></div>
          </div>
          <div className="space-y-4">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 bg-muted rounded animate-pulse"></div>
                  <div className="h-4 w-28 bg-muted rounded animate-pulse"></div>
                </div>
                <div className="h-4 w-16 bg-muted rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}