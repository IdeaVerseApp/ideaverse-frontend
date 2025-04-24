export default function Loading() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center space-y-4">
        <div className="h-16 w-16 animate-spin rounded-full border-t-4 border-b-4 border-indigo-600"></div>
        <p className="text-xl font-medium text-gray-700">Loading...</p>
      </div>
    </div>
  )
}

