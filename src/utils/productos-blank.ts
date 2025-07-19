import type { Option } from "@/components/ui/SelectCustom";
import type { ProductosProps } from "@/types/productos";


 export const products : ProductosProps[] = [
    {
      id: "1",
      name: "Pastel de frutos rojos",
      category: "Postres",
      price: "2160",
      cost: "1200",
      stock: "15",
      soldToday: "25",
      revenue: "54000",
      trend: "up",
      trendValue: "12",
      imageUrl: "🍰"
    },
    {
      id: "2",
      name: "Café cortado",
      category: "Bebidas",
      price: "1025",
      cost: "400",
      stock: "0",
      soldToday: "40",
      revenue: "41000",
      trend: "up",
      trendValue: "8",
      imageUrl: "☕"
    },
    {
      id: "3",
      name: "Pan con palta",
      category: "Comidas",
      price: "2312",
      cost: "1100",
      stock: "8",
      soldToday: "16",
      revenue: "37000",
      trend: "down",
      trendValue: "5",
      imageUrl: "🥑"
    },
    {
      id: "4",
      name: "Cookie de ciruela",
      category: "Postres",
      price: "2833",
      cost: "1500",
      stock: "22",
      soldToday: "12",
      revenue: "34000",
      trend: "up",
      trendValue: "15",
      imageUrl: "🍪"
    },
    {
      id: "5",
      name: "Cappuccino",
      category: "Bebidas",
      price: "1450",
      cost: "500",
      stock: "0",
      soldToday: "35",
      revenue: "50750",
      trend: "up",
      trendValue: "20",
      imageUrl: "☕"
    },
    {
      id: "6",
      name: "Sandwich de jamón",
      category: "Comidas",
      price: "3200",
      cost: "1800",
      stock: "12",
      soldToday: "18",
      revenue: "57600",
      trend: "up",
      trendValue: "6",
      imageUrl: "🥪"
    }
  ];

  export const categories : Option[] = [
    {
      value: "Todas las categorias",
      label: "Todas las categorias"
    },
    {
      value: "Bebidas",
      label: "Bebidas"
    },
    {
      value: "Comidas",
      label: "Comidas"
    },
    {
      value: "Postres",
      label: "Postres"
    }
  ];