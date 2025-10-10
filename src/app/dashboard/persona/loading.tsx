export default function PersonaLoading() {
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
          <div className="h-9 w-16 bg-muted animate-pulse rounded"></div>
        </div>
      </div>

      {/* Success Message Skeleton */}
      <div className="h-12 bg-green-50 border border-green-200 rounded-lg animate-pulse"></div>

      {/* Tabs Skeleton */}
      <div className="space-y-4">
        {/* Tab Headers */}
        <div className="flex space-x-1 p-1 bg-muted rounded-lg w-fit">
          <div className="h-8 w-24 bg-muted/50 animate-pulse rounded"></div>
          <div className="h-8 w-28 bg-muted/50 animate-pulse rounded"></div>
        </div>

        {/* Identity Tab Content */}
        <div className="space-y-6">
          {/* Profile Chatbot Card */}
          <div className="rounded-lg border bg-card p-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="h-6 w-32 bg-muted animate-pulse rounded"></div>
                <div className="h-4 w-56 bg-muted animate-pulse rounded"></div>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="p-4 rounded-lg border-2 bg-muted animate-pulse">
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="h-6 w-6 bg-muted animate-pulse rounded"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-4 w-20 bg-muted animate-pulse rounded"></div>
                          <div className="h-3 w-32 bg-muted animate-pulse rounded"></div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        {Array.from({ length: 4 }).map((_, j) => (
                          <div key={j} className="flex items-center gap-2">
                            <div className="w-1 h-1 bg-muted animate-pulse rounded-full"></div>
                            <div className="h-3 w-16 bg-muted animate-pulse rounded"></div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* AI Name & Welcome Message Card */}
            <div className="rounded-lg border bg-card p-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="h-6 w-32 bg-muted animate-pulse rounded"></div>
                  <div className="h-4 w-48 bg-muted animate-pulse rounded"></div>
                </div>
                <div className="space-y-3">
                  <div className="h-4 w-16 bg-muted animate-pulse rounded"></div>
                  <div className="h-10 w-full bg-muted animate-pulse rounded"></div>
                  <div className="flex justify-between">
                    <div className="h-3 w-32 bg-muted animate-pulse rounded"></div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="h-4 w-24 bg-muted animate-pulse rounded"></div>
                  <div className="h-32 w-full bg-muted animate-pulse rounded"></div>
                  <div className="flex justify-between">
                    <div className="h-4 w-32 bg-muted animate-pulse rounded"></div>
                    <div className="h-6 w-20 bg-muted animate-pulse rounded"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 w-28 bg-muted animate-pulse rounded"></div>
                  <div className="flex gap-2">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="h-8 w-24 bg-muted animate-pulse rounded"></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Preview Card */}
            <div className="rounded-lg border bg-card p-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="h-6 w-20 bg-muted animate-pulse rounded"></div>
                  <div className="h-4 w-56 bg-muted animate-pulse rounded"></div>
                </div>
                <div className="bg-slate-50 rounded-lg p-4 border">
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-full bg-muted animate-pulse"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-32 bg-muted animate-pulse rounded"></div>
                      <div className="space-y-1">
                        <div className="h-3 w-full bg-muted animate-pulse rounded"></div>
                        <div className="h-3 w-4/5 bg-muted animate-pulse rounded"></div>
                        <div className="h-3 w-3/4 bg-muted animate-pulse rounded"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Karakteristik Card */}
          <div className="rounded-lg border bg-card p-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="h-6 w-32 bg-muted animate-pulse rounded"></div>
                <div className="h-4 w-64 bg-muted animate-pulse rounded"></div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="space-y-2">
                      <div className="h-4 w-20 bg-muted animate-pulse rounded"></div>
                      <div className="h-10 w-full bg-muted animate-pulse rounded"></div>
                    </div>
                  ))}
                </div>
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="space-y-2">
                      <div className="h-4 w-24 bg-muted animate-pulse rounded"></div>
                      <div className="h-10 w-full bg-muted animate-pulse rounded"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}