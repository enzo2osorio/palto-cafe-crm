export function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-5xl font-bold mb-4">404</h1>
      <p className="text-xl text-muted-foreground mb-8">Página no encontrada</p>
      <a href="/dashboard" className="text-primary underline">Ir al dashboard</a>
    </div>
  );
}