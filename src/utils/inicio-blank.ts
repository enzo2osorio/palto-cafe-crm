import type { KPISProps } from "@/types/inicio";
import { DollarSign, Package, TrendingDown } from "lucide-react";

export const kpiData : KPISProps[] = [
    {
      title: "Ventas totales",
      value: "$50k",
      change: "+10% en comparación de ayer",
      trend: "up",
      icon: DollarSign
    },
    {
      title: "Órdenes",
      value: "284",
      change: "+34% en comparación del anterior mes",
      trend: "up",
      icon: Package
    },
    {
      title: "Ingresos totales",
      value: "$45.6k",
      change: "-24% en comparación de ayer",
      trend: "down",
      icon: TrendingDown
    }
  ];