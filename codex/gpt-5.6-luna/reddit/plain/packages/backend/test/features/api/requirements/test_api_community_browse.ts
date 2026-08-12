import * as api from "@benchmark/reddit-api";
import typia from "typia";
import { authorize, image } from "../../../helpers/RedditScenario";
import { page, requireValue } from "../../../helpers/RequirementTest";

/**
 * Proves public community browsing and name search return paged results.
 *
 * 1. Create the actors and prerequisite records used by test_api_community_browse.
 * 2. Execute test_api_community_browse's primary generated API operation for the documented scenario.
 * 3. Assert the returned business outcome and the public follow-up state when the requirement names one.
 */ 
export async function test_api_community_browse(connection: api.IConnection): Promise<void> {
  // Step 1: Create the actors and prerequisite records used by test_api_community_browse.
  // Step 2: Execute test_api_community_browse's primary generated API operation for the documented scenario.
  // Step 3: Assert the returned business outcome and the public follow-up state when the requirement names one.
  const account = await authorize(connection.host); const community = await api.functional.communities.createCommunity(account, { name: `browse_${Date.now().toString(36)}`, description: "Browse community", icon: image() });
  typia.assert(community); let result = await api.functional.communities.communities({ host: connection.host }, { ...page(), search: "" });
  typia.assert(result); requireValue(result.pagination.limit === 25, "Community browse did not use the default page size.");
  while (!result.data.some((item) => item.id === community.id) && result.pagination.continuation !== null) {
    result = await api.functional.communities.communities({ host: connection.host }, { search: "", continuation: result.pagination.continuation });
    typia.assert(result);
  }
  requireValue(result.data.some((item) => item.id === community.id), "Community browse did not return the created community in a complete paged traversal."); }



