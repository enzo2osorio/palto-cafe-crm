import { Card } from "@/components/ui/card"

export const HistorialSkeleton = () => {
  return (
    <Card className="card-warm p-6 border-0">
      <div className="flex items-center justify-between mb-6">
        <div className="h-6 w-48 rounded-md bg-gray-300 dark:bg-gray-700 animate-pulse" />
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-md bg-gray-300 dark:bg-gray-700 animate-pulse" />
          <div className="h-8 w-32 rounded-md bg-gray-300 dark:bg-gray-700 animate-pulse" />
        </div>
      </div>
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="bg-white dark:bg-accent rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-gray-300 dark:bg-gray-700 animate-pulse" />
                <div>
                  <div className="h-4 w-32 rounded-md bg-gray-300 dark:bg-gray-700 animate-pulse mb-2" />
                  <div className="h-3 w-24 rounded-md bg-gray-300 dark:bg-gray-700 animate-pulse mb-1" />
                  <div className="flex items-center space-x-4 mt-1">
                    <div className="h-3 w-20 rounded-md bg-gray-300 dark:bg-gray-700 animate-pulse" />
                    <div className="h-3 w-16 rounded-md bg-gray-300 dark:bg-gray-700 animate-pulse" />
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="h-5 w-16 rounded-md bg-gray-300 dark:bg-gray-700 animate-pulse" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}