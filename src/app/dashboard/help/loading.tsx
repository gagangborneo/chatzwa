export default function HelpLoading() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between space-y-2">
        <div className="space-y-1">
          <div className="h-8 w-32 bg-muted animate-pulse rounded"></div>
          <div className="h-4 w-80 bg-muted animate-pulse rounded"></div>
        </div>
      </div>

      {/* Search Bar Skeleton */}
      <div className="max-w-2xl">
        <div className="relative">
          <div className="h-10 w-full bg-muted animate-pulse rounded-lg pl-10"></div>
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 bg-muted animate-pulse rounded"></div>
        </div>
      </div>

      {/* Quick Links Skeleton */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-lg border bg-card p-6">
            <div className="flex items-center space-x-4">
              <div className="h-10 w-10 bg-muted animate-pulse rounded-lg"></div>
              <div className="flex-1 min-w-0 space-y-2">
                <div className="h-4 w-24 bg-muted animate-pulse rounded"></div>
                <div className="h-3 w-32 bg-muted animate-pulse rounded"></div>
              </div>
              <div className="h-4 w-4 bg-muted animate-pulse rounded"></div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Popular Questions Skeleton */}
        <div className="lg:col-span-1">
          <div className="rounded-lg border bg-card p-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="h-6 w-32 bg-muted animate-pulse rounded"></div>
                <div className="h-4 w-48 bg-muted animate-pulse rounded"></div>
              </div>
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i}>
                    <div className="h-12 w-full bg-muted animate-pulse rounded"></div>
                    <div className="ml-8 mt-2 h-16 w-full bg-muted/50 rounded-lg"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Categories Skeleton */}
        <div className="lg:col-span-2">
          <div className="rounded-lg border bg-card p-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="h-6 w-28 bg-muted animate-pulse rounded"></div>
                <div className="h-4 w-56 bg-muted animate-pulse rounded"></div>
              </div>
              <div className="h-[600px] space-y-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="border rounded-lg">
                    <div className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 bg-muted animate-pulse rounded-lg"></div>
                          <div className="space-y-1">
                            <div className="h-4 w-32 bg-muted animate-pulse rounded"></div>
                            <div className="h-3 w-48 bg-muted animate-pulse rounded"></div>
                            <div className="h-5 w-16 bg-muted animate-pulse rounded"></div>
                          </div>
                        </div>
                        <div className="h-4 w-4 bg-muted animate-pulse rounded"></div>
                      </div>
                    </div>
                    <div className="px-4 pb-4 space-y-2">
                      {Array.from({ length: 3 }).map((_, j) => (
                        <div key={j} className="border-l-2 border-muted pl-4">
                          <div className="h-8 w-full bg-muted animate-pulse rounded"></div>
                          <div className="ml-7 mt-2 h-12 w-full bg-muted/50 rounded-lg"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Support Skeleton */}
      <div className="rounded-lg border bg-card p-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="h-6 w-32 bg-muted animate-pulse rounded"></div>
            <div className="h-4 w-64 bg-muted animate-pulse rounded"></div>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-4 border rounded-lg">
                <div className="h-10 w-10 bg-muted animate-pulse rounded-full"></div>
                <div className="space-y-1">
                  <div className="h-4 w-24 bg-muted animate-pulse rounded"></div>
                  <div className="h-3 w-32 bg-muted animate-pulse rounded"></div>
                  <div className="h-3 w-24 bg-muted animate-pulse rounded"></div>
                  <div className="h-8 w-20 bg-muted animate-pulse rounded mt-1"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}