import { Card } from "@/components/ui/card"

export const GraficoVentasDiarias = () => {
  return (
    <Card className="card-warm p-6 border-0">
          <div className="space-y-6">
            <h3 className="font-body text-2xl text-center text-foreground">
              Ventas diarias de todos los productos
            </h3>
            
            <div className="flex items-end justify-center space-x-4 h-64">
              {/* Etiquetas del eje Y */}
              <div className="flex flex-col justify-between h-full text-right text-muted-foreground font-ui py-2">
                <span>$50 000</span>
                <span>$40 000</span>
                <span>$30 000</span>
                <span>$20 000</span>
                <span>$10 000</span>
                <span>$0</span>
              </div>
              
              {/* Gráfico usando la imagen importada */}
              <div className="flex-1 h-full relative">
                <img
                  className="w-full h-full bg-contain bg-center bg-no-repeat"
                  src='/images/grafico-inicio-sample.png'
                />
              </div>
            </div>
            
            {/* Etiquetas del eje X */}
            <div className="flex justify-between text-muted-foreground font-ui px-12">
              {/* TODO: arreglar esto de las fechas para que se coloquen dinamicamente segun el numero de barras que colocare, creo que es mejor solo 7 para mostrar de domingo a domingo. */}
              {['Lun', 'Mar', 'Mier', 'Jue', 'Vier', 'Sab', 'Dom', 'Lun', 'Mar', 'Mier'].map((day, index) => (
                <span key={index}>{day}</span>
              ))}
            </div>
          </div>
        </Card>
  )
}
