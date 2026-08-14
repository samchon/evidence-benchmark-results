export function formatMoney(value: number, currency = "USD"): string {
  return new Intl.NumberFormat(undefined, { style: "currency", currency, maximumFractionDigits: 2 }).format(value);
}

export function formatDate(value: string | null | undefined): string {
  if (value === null || value === undefined) return "Not set";
  const date = new Date(value);
  return Number.isNaN(date.valueOf()) ? value : new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(date);
}

export function errorMessage(error: unknown): string {
  if (error instanceof Error && error.message.length > 0) return error.message;
  return "The request could not be completed. Check the fields and try again.";
}

export function toDateTimeLocal(value: Date = new Date()): string {
  const offset = value.getTimezoneOffset();
  return new Date(value.getTime() - offset * 60_000).toISOString().slice(0, 16);
}

