export const money = (value: number): string =>
  new Intl.NumberFormat(undefined, { style: "currency", currency: "USD" }).format(value);

export const instant = (value: string | null | undefined): string =>
  value === null || value === undefined ? "Not recorded" : new Date(value).toLocaleString();

export const diagnosis = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return "The request could not be completed. Check the fields and try again.";
};

export const pageInput = (page: number, limit = 12) => ({ page, limit });
