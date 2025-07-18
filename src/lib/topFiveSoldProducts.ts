import type { ProductosProps } from "@/types/productos";
import { products } from "@/utils/productos-blank";

export const topFiveSoldProducts : ProductosProps[] = products
  .sort((a, b) => Number(b.soldToday) - Number(a.soldToday))
  .slice(0, 5);