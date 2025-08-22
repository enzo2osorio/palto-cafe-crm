export const getLast6Months = () => {
  const formatter = new Intl.DateTimeFormat("es-ES", { month: "long" }); // nombres en español
  const months: string[] = [];
  const today = new Date();

  for (let i = 5; i >= 0; i--) {
    const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const monthName = formatter.format(d);
    // Capitalizar primera letra (ej: "agosto" -> "Agosto")
    months.push(monthName.charAt(0).toUpperCase() + monthName.slice(1));
  }

  return months;
};