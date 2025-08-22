export function InicioSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Header */}
      <div className="space-y-2">
        <div className="h-4 w-32 bg-muted rounded" />
        <div className="h-10 w-64 bg-muted rounded" />
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="p-6 py-10 rounded-xl bg-muted/50 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 bg-muted rounded-full" />
              <div className="w-16 h-6 bg-muted rounded" />
            </div>
            <div className="h-6 w-24 bg-muted rounded" />
            <div className="h-4 w-32 bg-muted rounded" />
            <div className="h-3 w-20 bg-muted rounded" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Gráfico de ventas diarias */}
        <div className="p-6 rounded-xl bg-muted/50 flex flex-col gap-6">
          <div className="h-6 w-48 bg-muted rounded mx-auto" />
          <div className="h-48 w-full bg-muted rounded" />
          <div className="flex justify-between mt-4">
            {[...Array(7)].map((_, i) => (
              <div key={i} className="h-3 w-8 bg-muted rounded" />
            ))}
          </div>
        </div>
        {/* Top productos ABC */}
        <div className="p-6 rounded-xl bg-muted/50 flex flex-col gap-6">
          <div className="h-6 w-56 bg-muted rounded mx-auto" />
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex gap-4">
                <div className="h-4 w-24 bg-muted rounded" />
                <div className="h-4 w-16 bg-muted rounded" />
                <div className="h-4 w-20 bg-muted rounded" />
                <div className="h-4 w-12 bg-muted rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Gráficos circulares */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {[1, 2].map((i) => (
          <div key={i} className="p-8 rounded-xl bg-muted/50 flex flex-col items-center gap-6">
            <div className="w-32 h-32 bg-muted rounded-full" />
            <div className="h-4 w-40 bg-muted rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}