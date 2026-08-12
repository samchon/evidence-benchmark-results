import { HttpError } from "@benchmark/todo-api";

export const formatCalendarDate = (value: string | null): string => {
  if (value === null) return "No date";
  const [year, month, day] = value.split("-");
  if (year === undefined || month === undefined || day === undefined) return "No date";
  return new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(Number(year), Number(month) - 1, Number(day))));
};

export const formatDateTime = (value: string | null): string => {
  if (value === null) return "Not recorded";
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
};

export const errorMessage = (error: unknown): string => {
  if (error instanceof HttpError) {
    const payload: unknown = error.toJSON<unknown>().message;
    if (typeof payload === "string" && payload.length > 0) return payload;
    if (Array.isArray(payload)) {
      const messages = payload
        .filter((value: unknown): value is { message?: unknown } => typeof value === "object" && value !== null)
        .map((value) => (typeof value.message === "string" ? value.message : ""))
        .filter(Boolean);
      if (messages.length > 0) return messages.join(" ");
    }
    if (error.status === 401) return "Your session is no longer valid. Sign in again.";
    if (error.status === 403) return "This action is not available for your account.";
    if (error.status === 404) return "That private item is no longer available.";
    return `The server returned ${error.status}. Try again.`;
  }
  return error instanceof Error ? error.message : "Something went wrong. Try again.";
};

export const firstInvalid = (form: HTMLFormElement): void => {
  const invalid = form.querySelector<HTMLElement>(":invalid");
  invalid?.focus();
};
