import * as api from "@benchmark/reddit-api";
import typia from "typia";
import { authorize, image } from "../../../helpers/RedditScenario";
import { page, requireValue, refused } from "../../../helpers/RequirementTest";

/**
 * Proves community creation bootstraps owner and subscriber state.
 *
 * 1. Create the actors and prerequisite records used by test_api_community_create.
 * 2. Execute test_api_community_create's primary generated API operation for the documented scenario.
 * 3. Assert the returned business outcome and the public follow-up state when the requirement names one.
 */ 
export async function test_api_community_create(connection: api.IConnection): Promise<void> {
  // Step 1: Create the actors and prerequisite records used by test_api_community_create.
  // Step 2: Execute test_api_community_create's primary generated API operation for the documented scenario.
  // Step 3: Assert the returned business outcome and the public follow-up state when the requirement names one.
  const account = await authorize(connection.host); const stamp = Date.now().toString(36); const name = `create_${stamp}`;
  if (!await refused(() => api.functional.communities.createCommunity(account, { name: `${name}${"x".repeat(50)}`, description: "A valid community", icon: image() }))) throw new Error("Community creation accepted a name longer than 50 characters.");
  if (!await refused(() => api.functional.communities.createCommunity(account, { name: `description_${stamp}`, description: "x".repeat(1001), icon: image() }))) throw new Error("Community creation accepted a description longer than 1,000 characters.");
  const result = await api.functional.communities.createCommunity(account, { name, description: "A valid community", icon: image() });
  typia.assert(result); requireValue(result.name === name && result.status === "active" && result.owner !== null && result.subscriberCount === 1, "Community creation did not bootstrap its active owner subscription."); const catalog = await api.functional.communities.communities({ host: connection.host }, { ...page(), search: name });
  typia.assert(catalog); requireValue(catalog.data.some((community) => community.id === result.id), "Created community was not visible through the public catalog."); }



