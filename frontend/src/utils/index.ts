export function formatDate(fecha?: string): string {
  if (fecha) {
    const date = new Date(fecha);
    const formatter = new Intl.DateTimeFormat("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    return formatter.format(date);
  }

  return "";
}
