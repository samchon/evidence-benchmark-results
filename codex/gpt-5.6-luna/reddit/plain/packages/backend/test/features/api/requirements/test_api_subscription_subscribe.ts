import * as api from "@benchmark/reddit-api";
import typia from "typia";
import { scenario } from "../../../helpers/RedditScenario";
import { page, requireValue } from "../../../helpers/RequirementTest";

/**
 * Proves subscription activation is idempotent.
 *
 * 1. Create the actors and prerequisite records used by test_api_subscription_subscribe.
 * 2. Execute test_api_subscription_subscribe's primary generated API operation for the documented scenario.
 * 3. Assert the returned business outcome and the public follow-up state when the requirement names one.
 */ 
export async function test_api_subscription_subscribe(connection: api.IConnection): Promise<void> {
  // Step 1: Create the actors and prerequisite records used by test_api_subscription_subscribe.
  // Step 2: Execute test_api_subscription_subscribe's primary generated API operation for the documented scenario.
  // Step 3: Assert the returned business outcome and the public follow-up state when the requirement names one.
  const state = await scenario(connection.host); const ended = await api.functional.community.subscribe.unsubscribe(state.member, state.community.id); typia.assert(ended); requireValue(ended, "Subscription setup did not end the active membership."); const result = await api.functional.community.subscribe.subscribe(state.member, state.community.id);
  typia.assert(result); requireValue(result.id === state.community.id && result.status === "active" && result.subscriberCount === 2, "Subscription activation did not report the restored active membership."); const duplicate = await api.functional.community.subscribe.subscribe(state.member, state.community.id); typia.assert(duplicate); requireValue(duplicate.subscriberCount === result.subscriberCount, "Duplicate subscription changed the subscriber count."); const subscriptions = await api.functional.subscriptions(state.member, page());
  typia.assert(subscriptions); requireValue(subscriptions.data.some((item) => item.community.id === state.community.id), "Subscription activation did not restore the active membership list."); }


