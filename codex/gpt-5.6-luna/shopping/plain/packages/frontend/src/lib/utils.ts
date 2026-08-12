import type { IShoppingProduct, IShoppingReview } from "@benchmark/shopping-api";

export function formatMoney(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatDate(value: string | null | undefined): string {
  if (value === null || value === undefined) return "Not recorded";
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function formatDay(value: string | null | undefined): string {
  if (value === null || value === undefined) return "Not recorded";
  return new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(
    new Date(`${value}T00:00:00Z`),
  );
}

export function formatPrice(value: IShoppingProduct["displayedPrice"]): string {
  return typeof value === "number"
    ? formatMoney(value)
    : `${formatMoney(value.min)} to ${formatMoney(value.max)}`;
}

export function reviewLabel(review: IShoppingReview): string {
  return `${review.rating} out of 5 stars`;
}

export function toErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return "The operation could not be completed. Please try again.";
}

export function normalizeOptional(value: string): string | undefined {
  const trimmed = value.trim();
  return trimmed === "" ? undefined : trimmed;
}
