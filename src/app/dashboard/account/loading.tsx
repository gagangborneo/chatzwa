export default function AccountLoading() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between space-y-2">
        <div className="space-y-1">
          <div className="h-8 w-32 bg-muted animate-pulse rounded"></div>
          <div className="h-4 w-80 bg-muted animate-pulse rounded"></div>
        </div>
        <div className="h-9 w-32 bg-muted animate-pulse rounded"></div>
      </div>

      {/* Success Message Skeleton */}
      <div className="h-12 bg-green-50 border border-green-200 rounded-lg animate-pulse"></div>

      {/* Tabs Skeleton */}
      <div className="space-y-4">
        {/* Tab Headers */}
        <div className="flex space-x-1 p-1 bg-muted rounded-lg w-fit">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-8 w-24 bg-muted/50 animate-pulse rounded"></div>
          ))}
        </div>

        {/* Profile Tab Content */}
        <div className="grid gap-4 md:grid-cols-3">
          {/* Profile Card */}
          <div className="md:col-span-1">
            <div className="rounded-lg border bg-card p-6">
              <div className="space-y-4">
                <div className="text-center space-y-2">
                  <div className="h-6 w-32 bg-muted animate-pulse rounded mx-auto"></div>
                  <div className="h-4 w-48 bg-muted animate-pulse rounded mx-auto"></div>
                </div>
                <div className="flex flex-col items-center space-y-4">
                  <div className="h-24 w-24 bg-muted animate-pulse rounded-full"></div>
                  <div className="space-y-2">
                    <div className="h-5 w-32 bg-muted animate-pulse rounded"></div>
                    <div className="h-4 w-24 bg-muted animate-pulse rounded"></div>
                    <div className="h-5 w-20 bg-muted animate-pulse rounded mx-auto"></div>
                  </div>
                </div>
                <div className="h-px bg-muted animate-pulse"></div>
                <div className="space-y-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="h-4 w-4 bg-muted animate-pulse rounded"></div>
                      <div className="h-3 w-32 bg-muted animate-pulse rounded"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Personal Information Card */}
          <div className="md:col-span-2 space-y-4">
            <div className="rounded-lg border bg-card p-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="h-6 w-32 bg-muted animate-pulse rounded"></div>
                  <div className="h-4 w-64 bg-muted animate-pulse rounded"></div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="space-y-2">
                      <div className="h-4 w-20 bg-muted animate-pulse rounded"></div>
                      <div className="h-10 w-full bg-muted animate-pulse rounded"></div>
                    </div>
                  ))}
                </div>
                <div className="space-y-2">
                  <div className="h-4 w-12 bg-muted animate-pulse rounded"></div>
                  <div className="h-24 w-full bg-muted animate-pulse rounded"></div>
                  <div className="h-3 w-16 bg-muted animate-pulse rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Security Tab Content */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* Password Management Card */}
          <div className="rounded-lg border bg-card p-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="h-6 w-36 bg-muted animate-pulse rounded"></div>
                <div className="h-4 w-60 bg-muted animate-pulse rounded"></div>
              </div>
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <div className="h-4 w-24 bg-muted animate-pulse rounded"></div>
                    <div className="h-10 w-full bg-muted animate-pulse rounded"></div>
                  </div>
                ))}
                <div className="h-10 w-full bg-muted animate-pulse rounded"></div>
              </div>
            </div>
          </div>

          {/* Two-Factor Authentication Card */}
          <div className="rounded-lg border bg-card p-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="h-6 w-32 bg-muted animate-pulse rounded"></div>
                <div className="h-4 w-56 bg-muted animate-pulse rounded"></div>
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="h-4 w-20 bg-muted animate-pulse rounded"></div>
                  <div className="h-3 w-40 bg-muted animate-pulse rounded"></div>
                </div>
                <div className="h-6 w-12 bg-muted animate-pulse rounded"></div>
              </div>
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                <div className="flex items-start gap-2">
                  <div className="h-4 w-4 bg-muted animate-pulse rounded mt-0.5"></div>
                  <div className="space-y-1">
                    <div className="h-3 w-24 bg-muted animate-pulse rounded"></div>
                    <div className="h-3 w-full bg-muted animate-pulse rounded"></div>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-4 w-24 bg-muted animate-pulse rounded"></div>
                <div className="h-3 w-48 bg-muted animate-pulse rounded"></div>
                <div className="h-10 w-full bg-muted animate-pulse rounded"></div>
              </div>
            </div>
          </div>

          {/* Login Activity Card */}
          <div className="md:col-span-2 rounded-lg border bg-card p-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="h-6 w-28 bg-muted animate-pulse rounded"></div>
                <div className="h-4 w-64 bg-muted animate-pulse rounded"></div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-green-100 rounded-full"></div>
                    <div className="space-y-1">
                      <div className="h-4 w-24 bg-muted animate-pulse rounded"></div>
                      <div className="h-3 w-40 bg-muted animate-pulse rounded"></div>
                    </div>
                  </div>
                  <div className="h-5 w-16 bg-muted animate-pulse rounded"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 w-20 bg-muted animate-pulse rounded"></div>
                  <div className="space-y-2">
                    {Array.from({ length: 2 }).map((_, i) => (
                      <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 bg-gray-100 rounded-full"></div>
                          <div className="space-y-1">
                            <div className="h-3 w-24 bg-muted animate-pulse rounded"></div>
                            <div className="h-2 w-32 bg-muted animate-pulse rounded"></div>
                          </div>
                        </div>
                        <div className="h-8 w-16 bg-muted animate-pulse rounded"></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Notifications Tab Content */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* Email Notifications Card */}
          <div className="rounded-lg border bg-card p-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="h-6 w-32 bg-muted animate-pulse rounded"></div>
                <div className="h-4 w-56 bg-muted animate-pulse rounded"></div>
              </div>
              <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="h-4 w-24 bg-muted animate-pulse rounded"></div>
                      <div className="h-3 w-40 bg-muted animate-pulse rounded"></div>
                    </div>
                    <div className="h-6 w-12 bg-muted animate-pulse rounded"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* System Notifications Card */}
          <div className="rounded-lg border bg-card p-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="h-6 w-32 bg-muted animate-pulse rounded"></div>
                <div className="h-4 w-60 bg-muted animate-pulse rounded"></div>
              </div>
              <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="h-4 w-20 bg-muted animate-pulse rounded"></div>
                      <div className="h-3 w-36 bg-muted animate-pulse rounded"></div>
                    </div>
                    <div className="h-6 w-12 bg-muted animate-pulse rounded"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Tab Content */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-lg border bg-card p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="h-4 w-16 bg-muted animate-pulse rounded"></div>
                  <div className="h-4 w-4 bg-muted animate-pulse rounded"></div>
                </div>
                <div className="h-8 w-12 bg-muted animate-pulse rounded"></div>
                <div className="h-2 w-full bg-muted animate-pulse rounded"></div>
                <div className="h-3 w-16 bg-muted animate-pulse rounded"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Account Summary Card */}
        <div className="rounded-lg border bg-card p-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="h-6 w-28 bg-muted animate-pulse rounded"></div>
              <div className="h-4 w-64 bg-muted animate-pulse rounded"></div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-3">
                <div className="h-5 w-24 bg-muted animate-pulse rounded"></div>
                <div className="space-y-2">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex justify-between">
                      <div className="h-3 w-16 bg-muted animate-pulse rounded"></div>
                      <div className="h-3 w-20 bg-muted animate-pulse rounded"></div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-3">
                <div className="h-5 w-24 bg-muted animate-pulse rounded"></div>
                <div className="space-y-2">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex justify-between">
                      <div className="h-3 w-20 bg-muted animate-pulse rounded"></div>
                      <div className="h-3 w-12 bg-muted animate-pulse rounded"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Save Button Skeleton */}
      <div className="flex justify-end">
        <div className="h-10 w-32 bg-muted animate-pulse rounded"></div>
      </div>
    </div>
  )
}