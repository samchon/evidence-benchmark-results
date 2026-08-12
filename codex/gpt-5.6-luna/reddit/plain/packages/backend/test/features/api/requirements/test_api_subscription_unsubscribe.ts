import * as api from "@benchmark/reddit-api";
import typia from "typia";
import { scenario } from "../../../helpers/RedditScenario";
import { page, requireValue } from "../../../helpers/RequirementTest";

/**
 * Proves subscription termination preserves the community.
 *
 * 1. Create the actors and prerequisite records used by test_api_subscription_unsubscribe.
 * 2. Execute test_api_subscription_unsubscribe's primary generated API operation for the documented scenario.
 * 3. Assert the returned business outcome and the public follow-up state when the requirement names one.
 */ 
export async function test_api_subscription_unsubscribe(connection: api.IConnection): Promise<void> {
  // Step 1: Create the actors and prerequisite records used by test_api_subscription_unsubscribe.
  // Step 2: Execute test_api_subscription_unsubscribe's primary generated API operation for the documented scenario.
  // Step 3: Assert the returned business outcome and the public follow-up state when the requirement names one.
  const state = await scenario(connection.host); const result = await api.functional.community.subscribe.unsubscribe(state.member, state.community.id); typia.assert(result); requireValue(result.status === "active", "Subscription termination did not report the preserved community."); const subscriptions = await api.functional.subscriptions(state.member, page());
  typia.assert(subscriptions); const communities = await api.functional.communities.communities({ host: connection.host }, { ...page(), search: state.community.name });
  typia.assert(communities); requireValue(!subscriptions.data.some((item) => item.community.id === state.community.id) && communities.data.find((item) => item.id === state.community.id)?.subscriberCount === 1, "Subscription termination did not remove the active membership."); }



