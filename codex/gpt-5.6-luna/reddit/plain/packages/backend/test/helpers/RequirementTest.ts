import type * as api from "@benchmark/reddit-api";

/** Creates the default bounded page request used by requirement scenarios. */
export function page(): api.IPage.IRequest {
  return { page: 1, limit: 25 };
}

/** Proves a public operation refuses its invalid or unauthorized request. */
export async function refused(action: () => Promise<unknown>): Promise<boolean> {
  try {
    await action();
    return false;
  } catch {
    return true;
  }
}

/** Records a business assertion with an actionable failure message. */
export function requireValue(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

