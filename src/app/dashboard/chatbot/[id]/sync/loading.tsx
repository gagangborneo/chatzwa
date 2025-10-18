import { Loader2 } from 'lucide-react'

export default function DataSyncLoading() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between space-y-2">
        <div className="space-y-1">
          <div className="h-8 w-48 bg-muted animate-pulse rounded"></div>
          <div className="h-4 w-96 bg-muted animate-pulse rounded"></div>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-9 w-40 bg-muted animate-pulse rounded"></div>
          <div className="h-9 w-32 bg-muted animate-pulse rounded"></div>
        </div>
      </div>

      {/* Alert Skeleton */}
      <div className="border rounded-lg p-4 bg-muted/20 animate-pulse">
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 bg-muted animate-pulse rounded"></div>
          <div className="h-4 w-64 bg-muted animate-pulse rounded"></div>
        </div>
      </div>

      {/* Sync Stats Skeleton */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-lg border bg-card p-6">
            <div className="flex items-center justify-between space-y-0 pb-2">
              <div className="h-4 w-20 bg-muted animate-pulse rounded"></div>
              <div className="h-4 w-4 bg-muted animate-pulse rounded"></div>
            </div>
            <div className="h-8 w-12 bg-muted animate-pulse rounded mt-2"></div>
            {i === 1 || i === 3 ? (
              <div className="mt-3">
                <div className="h-2 w-full bg-muted animate-pulse rounded"></div>
              </div>
            ) : (
              <div className="h-3 w-24 bg-muted animate-pulse rounded mt-2"></div>
            )}
          </div>
        ))}
      </div>

      {/* Tabs Skeleton */}
      <div className="space-y-4">
        {/* Tab Headers */}
        <div className="flex space-x-1 p-1 bg-muted rounded-lg w-fit">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-8 w-24 bg-muted/50 animate-pulse rounded"></div>
          ))}
        </div>

        {/* Data Sources Table Skeleton */}
        <div className="rounded-lg border bg-card p-6">
          <div className="space-y-4">
            <div className="h-6 w-32 bg-muted animate-pulse rounded"></div>
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-4 border rounded">
                  <div className="h-4 w-32 bg-muted animate-pulse rounded"></div>
                  <div className="h-6 w-16 bg-muted animate-pulse rounded"></div>
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 bg-muted animate-pulse rounded"></div>
                    <div className="h-6 w-20 bg-muted animate-pulse rounded"></div>
                  </div>
                  <div className="h-4 w-24 bg-muted animate-pulse rounded"></div>
                  <div className="h-4 w-16 bg-muted animate-pulse rounded"></div>
                  <div className="h-4 w-12 bg-muted animate-pulse rounded"></div>
                  <div className="h-8 w-20 bg-muted animate-pulse rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sync History Table Skeleton */}
        <div className="rounded-lg border bg-card p-6">
          <div className="space-y-4">
            <div className="h-6 w-32 bg-muted animate-pulse rounded"></div>
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-4 border rounded">
                  <div className="h-4 w-32 bg-muted animate-pulse rounded"></div>
                  <div className="h-6 w-16 bg-muted animate-pulse rounded"></div>
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 bg-muted animate-pulse rounded"></div>
                    <div className="h-6 w-20 bg-muted animate-pulse rounded"></div>
                  </div>
                  <div className="h-4 w-16 bg-muted animate-pulse rounded"></div>
                  <div className="h-4 w-20 bg-muted animate-pulse rounded"></div>
                  <div className="h-4 w-16 bg-muted animate-pulse rounded"></div>
                  <div className="h-6 w-12 bg-muted animate-pulse rounded"></div>
                  <div className="h-4 w-24 bg-muted animate-pulse rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Embedding Models Grid Skeleton */}
        <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
          <div className="rounded-lg border bg-card p-6">
            <div className="space-y-4">
              <div className="h-6 w-40 bg-muted animate-pulse rounded"></div>
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="h-3 w-3 bg-muted animate-pulse rounded-full"></div>
                    <div className="space-y-1">
                      <div className="h-4 w-24 bg-muted animate-pulse rounded"></div>
                      <div className="h-3 w-32 bg-muted animate-pulse rounded"></div>
                    </div>
                  </div>
                  <div className="text-right space-y-1">
                    <div className="h-4 w-12 bg-muted animate-pulse rounded ml-auto"></div>
                    <div className="h-3 w-16 bg-muted animate-pulse rounded ml-auto"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border bg-card p-6">
            <div className="space-y-4">
              <div className="h-6 w-32 bg-muted animate-pulse rounded"></div>
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="h-4 w-24 bg-muted animate-pulse rounded"></div>
                    <div className="h-4 w-12 bg-muted animate-pulse rounded"></div>
                  </div>
                  <div className="h-2 w-full bg-muted animate-pulse rounded"></div>
                </div>
              ))}
              <div className="pt-4 border-t">
                <div className="h-9 w-full bg-muted animate-pulse rounded"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Settings Grid Skeleton */}
        <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="rounded-lg border bg-card p-6">
              <div className="space-y-4">
                <div className="h-6 w-32 bg-muted animate-pulse rounded"></div>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="h-4 w-24 bg-muted animate-pulse rounded"></div>
                    <div className="h-3 w-48 bg-muted animate-pulse rounded"></div>
                  </div>
                  <div className="h-5 w-10 bg-muted animate-pulse rounded"></div>
                </div>
                {Array.from({ length: 3 }).map((_, j) => (
                  <div key={j} className="space-y-2">
                    <div className="h-4 w-20 bg-muted animate-pulse rounded"></div>
                    <div className="h-9 w-full bg-muted animate-pulse rounded"></div>
                    <div className="h-3 w-64 bg-muted animate-pulse rounded"></div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Loading Indicator */}
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    </div>
  )
}