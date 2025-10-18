import { Loader2 } from 'lucide-react'

export default function KnowledgeBaseLoading() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between space-y-2">
        <div className="space-y-1">
          <div className="h-8 w-48 bg-muted animate-pulse rounded"></div>
          <div className="h-4 w-96 bg-muted animate-pulse rounded"></div>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-9 w-20 bg-muted animate-pulse rounded"></div>
          <div className="h-9 w-20 bg-muted animate-pulse rounded"></div>
        </div>
      </div>

      {/* Knowledge Stats Skeleton */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-lg border bg-card p-6">
            <div className="flex items-center justify-between space-y-0 pb-2">
              <div className="h-4 w-24 bg-muted animate-pulse rounded"></div>
              <div className="h-4 w-4 bg-muted animate-pulse rounded"></div>
            </div>
            <div className="h-8 w-16 bg-muted animate-pulse rounded mt-2"></div>
            {i === 1 || i === 3 ? (
              <div className="mt-2">
                <div className="h-2 w-full bg-muted animate-pulse rounded"></div>
              </div>
            ) : (
              <div className="h-3 w-32 bg-muted animate-pulse rounded mt-2"></div>
            )}
          </div>
        ))}
      </div>

      {/* Tabs Skeleton */}
      <div className="space-y-4">
        {/* Tab Headers - 2 tabs only */}
        <div className="flex space-x-1 p-1 bg-muted rounded-lg w-fit">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="h-8 w-32 bg-muted/50 animate-pulse rounded"></div>
          ))}
        </div>

        {/* Knowledge Data Tab Skeleton */}
        <div className="rounded-lg border bg-card p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="h-6 w-32 bg-muted animate-pulse rounded"></div>
              <div className="flex items-center gap-2">
                <div className="h-9 w-32 bg-muted animate-pulse rounded"></div>
                <div className="h-9 w-64 bg-muted animate-pulse rounded"></div>
              </div>
            </div>

            {/* Documents Table Skeleton */}
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center space-x-4 p-4 border rounded">
                  <div className="h-4 w-48 bg-muted animate-pulse rounded"></div>
                  <div className="h-6 w-20 bg-muted animate-pulse rounded"></div>
                  <div className="h-4 w-24 bg-muted animate-pulse rounded"></div>
                  <div className="h-6 w-16 bg-muted animate-pulse rounded"></div>
                  <div className="h-4 w-16 bg-muted animate-pulse rounded"></div>
                  <div className="h-6 w-20 bg-muted animate-pulse rounded"></div>
                  <div className="h-4 w-12 bg-muted animate-pulse rounded"></div>
                  <div className="h-4 w-12 bg-muted animate-pulse rounded"></div>
                  <div className="flex space-x-2">
                    <div className="h-8 w-8 bg-muted animate-pulse rounded"></div>
                    <div className="h-8 w-8 bg-muted animate-pulse rounded"></div>
                    <div className="h-8 w-8 bg-muted animate-pulse rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Indexing Activity Skeleton */}
        <div className="rounded-lg border bg-card p-6">
          <div className="h-6 w-32 bg-muted animate-pulse rounded mb-4"></div>
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-3 border rounded-lg">
                <div className="h-4 w-4 bg-muted animate-pulse rounded"></div>
                <div className="flex-1 space-y-1">
                  <div className="h-4 w-32 bg-muted animate-pulse rounded"></div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-24 bg-muted animate-pulse rounded"></div>
                    <div className="h-5 w-20 bg-muted animate-pulse rounded"></div>
                  </div>
                </div>
                <div className="h-6 w-16 bg-muted animate-pulse rounded"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Upload Files Tab Skeleton */}
        <div className="rounded-lg border bg-card p-6">
          <div className="space-y-6">
            {/* Upload Area Skeleton */}
            <div className="border-2 border-dashed border-muted rounded-lg p-6 text-center">
              <div className="h-12 w-12 bg-muted animate-pulse rounded mx-auto mb-4"></div>
              <div className="h-6 w-48 bg-muted animate-pulse rounded mx-auto mb-2"></div>
              <div className="h-4 w-64 bg-muted animate-pulse rounded mx-auto mb-2"></div>
              <div className="h-3 w-48 bg-muted animate-pulse rounded mx-auto mb-4"></div>
              <div className="h-9 w-32 bg-muted animate-pulse rounded mx-auto"></div>
            </div>

            {/* Upload Options Skeleton */}
            <div className="grid gap-4 md:grid-cols-2">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 w-24 bg-muted animate-pulse rounded"></div>
                  <div className="h-9 w-full bg-muted animate-pulse rounded"></div>
                </div>
              ))}
            </div>

            {/* File Types Skeleton */}
            <div className="grid gap-2 md:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center gap-2 p-2 border rounded">
                  <div className="h-4 w-4 bg-muted animate-pulse rounded"></div>
                  <div className="space-y-1">
                    <div className="h-4 w-24 bg-muted animate-pulse rounded"></div>
                    <div className="h-3 w-16 bg-muted animate-pulse rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Loading Indicator */}
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    </div>
  )
}