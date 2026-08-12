import * as api from "@benchmark/reddit-api";
import typia from "typia";
import { scenario } from "../../../helpers/RedditScenario";
import { page, requireValue } from "../../../helpers/RequirementTest";

/**
 * Proves a user can list every active subscription.
 *
 * 1. Create the actors and prerequisite records used by test_api_subscription_list.
 * 2. Execute test_api_subscription_list's primary generated API operation for the documented scenario.
 * 3. Assert the returned business outcome and the public follow-up state when the requirement names one.
 */ 
export async function test_api_subscription_list(connection: api.IConnection): Promise<void> {
  // Step 1: Create the actors and prerequisite records used by test_api_subscription_list.
  // Step 2: Execute test_api_subscription_list's primary generated API operation for the documented scenario.
  // Step 3: Assert the returned business outcome and the public follow-up state when the requirement names one.
  const state = await scenario(connection.host); const result = await api.functional.subscriptions(state.member, page());
  typia.assert(result); requireValue(result.data.some((item) => item.community.id === state.community.id && item.activatedAt.length > 0), "Subscription list did not expose the active community membership."); }




