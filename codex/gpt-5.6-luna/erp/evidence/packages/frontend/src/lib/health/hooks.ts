import { queryOptions, useQuery } from "@tanstack/react-query";
import type * as api from "@benchmark/erp-api";

import { apiConnection } from "@/lib/client";

async function readHealth() {
  if (apiConnection.simulate) return true;
  const response = await fetch(`${apiConnection.host}/health`);
  if (response.ok === false)
    throw new Error(`Health check failed with HTTP ${response.status}.`);
  return response.text();
}

const healthOptions = queryOptions({
  queryKey: ["health"],
  enabled: false,
  queryFn: readHealth,
});

/**
 * Reads the process health marker through the shared API connection.
 * @evidence {@link api.functional.health.get} Reaches the published health operation endpoint from a query hook.
 * @evidenceReview {@link api.functional.health.get} Read the generated health accessor and this hook, then ran the live health action and verified the hook requests the same GET /health operation.
 */
export function useHealth() {
  return useQuery(healthOptions);
}
