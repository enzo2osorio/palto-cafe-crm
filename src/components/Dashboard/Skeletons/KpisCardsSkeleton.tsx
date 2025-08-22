export function KPISCardsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div
          key={i}
          className="p-6 py-10 rounded-xl bg-muted/50 flex flex-col gap-4"
        >
          {/* Icono arriba a la izquierda + Badge */}
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 bg-muted rounded-full" />
            <div className="w-20 h-6 bg-muted rounded-lg" />
          </div>

          {/* Valor principal */}
          <div className="h-7 w-28 bg-muted rounded" />

          {/* Subtítulo */}
          <div className="h-4 w-32 bg-muted rounded" />

          {/* Mini descripción */}
          <div className="h-3 w-24 bg-muted rounded" />
        </div>
      ))}
    </div>
  );
}
