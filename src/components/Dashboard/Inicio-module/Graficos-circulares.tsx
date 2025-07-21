import { Card } from '@/components/ui/card'

export const GraficosCirculares = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {[
          { value: "80%", title: "% de ventas diarias para seguir con la meta diaria:" },
          { value: "74%", title: "% de ventas diarias para seguir con la meta diaria:" }
        ].map((metric, index) => (
          <Card key={index} className="card-warm p-8 border-0">
            <div className="flex flex-col items-center space-y-6">
              {/* Gráfico circular */}
              <div className="relative w-48 h-48">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
                  <circle
                    cx="100"
                    cy="100"
                    r="80"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    className="text-muted"
                  />
                  <circle
                    cx="100"
                    cy="100"
                    r="80"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${(parseInt(metric.value) / 100) * 502} 502`}
                    className="text-primary"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-display text-4xl text-foreground">{metric.value}</span>
                </div>
              </div>
              
              <p className="font-ui text-center text-foreground max-w-sm">{metric.title}</p>
            </div>
          </Card>
        ))}
      </div>
  )
}
