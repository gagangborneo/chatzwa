import { Card, CardContent, CardHeader } from '@/components/ui/card'

export default function UserDetailLoading() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between space-y-2">
        <div className="flex items-center space-x-4">
          <div className="h-8 w-16 bg-muted animate-pulse rounded"></div>
          <div className="space-y-2">
            <div className="h-8 w-48 bg-muted animate-pulse rounded"></div>
            <div className="h-4 w-96 bg-muted animate-pulse rounded"></div>
          </div>
        </div>
        <div className="flex space-x-2">
          <div className="h-9 w-24 bg-muted animate-pulse rounded"></div>
          <div className="h-9 w-20 bg-muted animate-pulse rounded"></div>
        </div>
      </div>

      {/* User Info Card Skeleton */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 bg-muted animate-pulse rounded-full"></div>
              <div className="space-y-1">
                <div className="h-6 w-32 bg-muted animate-pulse rounded"></div>
                <div className="flex space-x-2">
                  <div className="h-5 w-16 bg-muted animate-pulse rounded"></div>
                  <div className="h-5 w-20 bg-muted animate-pulse rounded"></div>
                  <div className="h-5 w-16 bg-muted animate-pulse rounded"></div>
                </div>
              </div>
            </div>
            <div className="h-9 w-20 bg-muted animate-pulse rounded"></div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 w-20 bg-muted animate-pulse rounded"></div>
                  <div className="h-10 w-full bg-muted animate-pulse rounded"></div>
                </div>
              ))}
            </div>
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 w-20 bg-muted animate-pulse rounded"></div>
                  <div className="h-10 w-full bg-muted animate-pulse rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards Skeleton */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 w-20 bg-muted animate-pulse rounded"></div>
              <div className="h-4 w-4 bg-muted animate-pulse rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 w-24 bg-muted animate-pulse rounded mb-2"></div>
              <div className="h-3 w-32 bg-muted animate-pulse rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs Skeleton */}
      <div className="space-y-4">
        <div className="flex space-x-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-10 w-28 bg-muted animate-pulse rounded"></div>
          ))}
        </div>

        {/* Overview Tab Skeleton */}
        <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <div className="h-6 w-24 bg-muted animate-pulse rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="h-4 w-24 bg-muted animate-pulse rounded"></div>
                    <div className="h-4 w-16 bg-muted animate-pulse rounded"></div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <div className="h-6 w-32 bg-muted animate-pulse rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="h-4 w-20 bg-muted animate-pulse rounded"></div>
                    <div className="h-4 w-20 bg-muted animate-pulse rounded"></div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Transactions Table Skeleton */}
        <Card>
          <CardHeader>
            <div className="h-6 w-40 bg-muted animate-pulse rounded"></div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {/* Table Header */}
              <div className="grid grid-cols-7 gap-4">
                {[...Array(7)].map((_, i) => (
                  <div key={i} className="h-4 bg-muted animate-pulse rounded"></div>
                ))}
              </div>
              {/* Table Rows */}
              {[...Array(5)].map((_, rowIndex) => (
                <div key={rowIndex} className="grid grid-cols-7 gap-4">
                  {[...Array(7)].map((_, colIndex) => (
                    <div key={colIndex} className="h-4 bg-muted animate-pulse rounded"></div>
                  ))}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Services Usage Skeleton */}
        <Card>
          <CardHeader>
            <div className="h-6 w-48 bg-muted animate-pulse rounded"></div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-muted animate-pulse rounded-lg"></div>
                      <div className="space-y-1">
                        <div className="h-4 w-24 bg-muted animate-pulse rounded"></div>
                        <div className="h-3 w-32 bg-muted animate-pulse rounded"></div>
                      </div>
                    </div>
                    <div className="text-right space-y-1">
                      <div className="h-4 w-16 bg-muted animate-pulse rounded ml-auto"></div>
                      <div className="h-3 w-20 bg-muted animate-pulse rounded ml-auto"></div>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="h-2 w-3/4 bg-muted animate-pulse rounded-full"></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Analytics Charts Skeleton */}
        <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
          {[...Array(2)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <div className="h-6 w-32 bg-muted animate-pulse rounded"></div>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] bg-muted animate-pulse rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Activity Summary Table Skeleton */}
        <Card>
          <CardHeader>
            <div className="h-6 w-32 bg-muted animate-pulse rounded"></div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {/* Table Header */}
              <div className="grid grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-4 bg-muted animate-pulse rounded"></div>
                ))}
              </div>
              {/* Table Rows */}
              {[...Array(5)].map((_, rowIndex) => (
                <div key={rowIndex} className="grid grid-cols-4 gap-4">
                  {[...Array(4)].map((_, colIndex) => (
                    <div key={colIndex} className="h-4 bg-muted animate-pulse rounded"></div>
                  ))}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}