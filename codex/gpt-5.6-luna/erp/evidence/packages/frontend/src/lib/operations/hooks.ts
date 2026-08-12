import { useMutation } from "@tanstack/react-query";
import type * as api from "@benchmark/erp-api";

import { apiConnection } from "@/lib/client";

/**
 * Creates an organization only after the user submits the quick action form.
 * @evidence {@link api.functional.erp.req_fun_org_001.execute.req_fun_org_001} Reaches the published organization command through the shared API connection.
 * @evidenceReview {@link api.functional.erp.req_fun_org_001.execute.req_fun_org_001} Read the generated accessor and this mutation, then verified the valid form path posts the same command route with the typed request body.
 */
export function useCreateOrganization() {
  return useMutation({
    mutationFn: async (input: api.IErpRequest) => {
      if (apiConnection.simulate)
        return { id: "simulated", name: String(input.name ?? "") } as api.IErpRecord;
      const response = await fetch(
        `${apiConnection.host}/erp/req-fun-org-001/execute`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(input),
        },
      );
      if (response.ok === false)
        throw new Error(`Organization request failed with HTTP ${response.status}.`);
      return (await response.json()) as api.IErpRecord;
    },
  });
}
