export const formatNumber = (num: string) => {
    return new Intl.NumberFormat('es-AR').format(parseFloat(num));
  };