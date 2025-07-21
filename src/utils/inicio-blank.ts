import type { KPISProps } from "@/types/inicio";
import { DollarSign, Package, TrendingDown } from "lucide-react";

export const kpiData : KPISProps[] = [
    {
      title: "Ventas totales",
      value: "$50k",
      change: "+10% en comparación de ayer",
      changeMin: "+10%",
      bgForBadge: "bg-green-400/50 dark:bg-green-800/50",
      colorTextForBadge: "text-green-800 dark:text-green-200",
      trend: "up",
      icon: DollarSign
    },
    {
      title: "Órdenes",
      value: "284",
      change: "+34% en comparación del anterior mes",
      changeMin: "+34%",
      bgForBadge: "bg-green-400/50 dark:bg-green-800/50",
      colorTextForBadge: "text-green-800 dark:text-green-200",
      trend: "up",
      icon: Package
    },
    {
      title: "Ingresos totales",
      value: "$45.6k",
      change: "-24% en comparación de ayer",
      changeMin: "-24%",
      bgForBadge: "bg-red-400/50 dark:bg-red-800/50",
      colorTextForBadge: "text-red-800 dark:text-red-200",
      trend: "down",
      icon: TrendingDown
    }
  ];