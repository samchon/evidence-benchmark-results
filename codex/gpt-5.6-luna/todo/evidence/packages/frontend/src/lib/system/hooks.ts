import * as api from "@benchmark/todo-api";
import { queryOptions, useQuery } from "@tanstack/react-query";

import { apiConnection } from "@/lib/client";

const healthOptions = () =>
  queryOptions({
    queryKey: ["system", "health"] as const,
    queryFn: () => api.functional.health.get(apiConnection),
    retry: 0,
    staleTime: 30_000,
  });

/**
 * Reads the backend health marker for the application shell.
 * @evidence {@link api.functional.health.get} Calls the generated backend health operation for shell availability.
 * @evidenceReview {@link api.functional.health.get} Read the generated SDK accessor and inspected this health query plus its shell-status handling.
 */
export function useHealth() {
  return useQuery(healthOptions());
}
