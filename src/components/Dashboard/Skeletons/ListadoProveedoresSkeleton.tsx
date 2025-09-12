// ...existing code...

export const ListadoProveedoresSkeleton = () => {
  const items = Array.from({ length: 10 });

  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 gap-6"
      aria-busy="true"
      aria-label="Cargando proveedores"
    >
      {items.map((_, idx) => (
        <div
          key={idx}
          className="card-warm border-0 overflow-hidden transition-shadow animate-pulse"
        >
          <div className="p-6 space-y-4">
            {/* Header skeleton */}
            <div className="flex items-start justify-between">
              <div className="space-y-2 w-3/4">
                <div className="h-5 bg-muted rounded-md w-1/2" />
                <div className="h-3 bg-muted/70 rounded-md w-1/4" />
              </div>

              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div className="w-8 h-8 bg-muted rounded-full" />
                  <div className="w-8 h-8 bg-muted rounded-full" />
                </div>
              </div>
            </div>

            {/* Rubro skeleton */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-muted rounded-xl p-3">
                <div className="h-3 bg-muted/70 rounded-md w-1/3 mb-2" />
                <div className="h-4 bg-muted rounded-md w-2/3" />
              </div>
              <div className="bg-muted rounded-xl p-3">
                <div className="h-3 bg-muted/70 rounded-md w-1/2 mb-2" />
                <div className="h-4 bg-muted rounded-md w-1/2" />
              </div>
            </div>

            {/* Aliases skeleton */}
            <div className="bg-primary/5 rounded-xl p-3">
              <div className="flex justify-between items-center">
                <div className="h-4 bg-muted/70 rounded-md w-24" />
                <div className="flex flex-wrap gap-2">
                  <div className="h-6 w-16 bg-muted rounded-full" />
                  <div className="h-6 w-12 bg-muted rounded-full" />
                  <div className="h-6 w-10 bg-muted rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}