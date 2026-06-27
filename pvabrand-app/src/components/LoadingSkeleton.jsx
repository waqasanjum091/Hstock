export default function LoadingSkeleton({ type = 'card', count = 6 }) {
  if (type === 'card') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(count)].map((_, i) => (
          <div key={i} className="rounded-xl overflow-hidden bg-white border border-gray-200">
            <div className="h-40 bg-gray-200 animate-pulse" />
            <div className="p-4 space-y-3">
              <div className="h-3 bg-gray-200 rounded w-1/3 animate-pulse" />
              <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
              <div className="h-3 bg-gray-200 rounded w-full animate-pulse" />
              <div className="flex justify-between items-center pt-2">
                <div className="h-5 bg-gray-200 rounded w-1/4 animate-pulse" />
                <div className="h-8 bg-gray-200 rounded w-1/4 animate-pulse" />
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (type === 'row') {
    return (
      <div className="space-y-4">
        {[...Array(count)].map((_, i) => (
          <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-white border border-gray-200">
            <div className="w-16 h-16 rounded-xl bg-gray-200 animate-pulse" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse" />
              <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse" />
            </div>
            <div className="h-6 bg-gray-200 rounded w-20 animate-pulse" />
          </div>
        ))}
      </div>
    )
  }

  return null
}
