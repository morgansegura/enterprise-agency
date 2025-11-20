import { Skeleton } from '@/components/ui/skeleton'

/**
 * Login Form Skeleton Loader
 * Mimics the structure of the login form while auth initializes
 */
export function LoginSkeleton() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        {/* Header */}
        <div>
          <Skeleton className="h-9 w-3/4 mx-auto mb-2" />
          <Skeleton className="h-4 w-2/3 mx-auto" />
        </div>

        {/* Form */}
        <div className="mt-8 space-y-6">
          {/* Email field */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>

          {/* Password field */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-full" />
          </div>

          {/* Submit button */}
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />

            {/* Forgot password link */}
            <div className="flex justify-center">
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
