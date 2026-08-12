import * as api from "@benchmark/reddit-api";
import typia from "typia";
import { authorizeDetailed, image } from "../../../helpers/RedditScenario";
import { page, requireValue } from "../../../helpers/RequirementTest";

/**
 * Proves owner deletion transfers an active community to its longest-serving subscriber.
 *
 * 1. Create the actors and prerequisite records used by test_api_account_delete_community_succession.
 * 2. Execute test_api_account_delete_community_succession's primary generated API operation for the documented scenario.
 * 3. Assert the returned business outcome and the public follow-up state when the requirement names one.
 */ 
export async function test_api_account_delete_community_succession(connection: api.IConnection): Promise<void> {
  // Step 1: Create the actors and prerequisite records used by test_api_account_delete_community_succession.
  // Step 2: Execute test_api_account_delete_community_succession's primary generated API operation for the documented scenario.
  // Step 3: Assert the returned business outcome and the public follow-up state when the requirement names one.
  const owner = await authorizeDetailed(connection.host); const community = await api.functional.communities.createCommunity(owner.connection, { name: `succession_${Date.now().toString(36)}`, description: "Succession community", icon: image() });
  typia.assert(community); const successor = await authorizeDetailed(connection.host); const subscribed = await api.functional.community.subscribe.subscribe(successor.connection, community.id); typia.assert(subscribed); const deleted = await api.functional.auth.account._delete.deleteAccount(owner.connection, { password: "password-123" }); typia.assert(deleted); requireValue(deleted, "Account deletion did not report success."); const catalog = await api.functional.communities.communities({ host: connection.host }, { ...page(), search: community.name });
  typia.assert(catalog); const current = catalog.data.find((item) => item.id === community.id); requireValue(current?.status === "active" && current.owner?.id === successor.user.id, "Owner deletion did not transfer community ownership to the subscriber."); const post = await api.functional.posts.createPost(successor.connection, { communityId: community.id, title: "Successor post", type: "text", text: "Ownership transferred" });
  typia.assert(post); requireValue(post.author?.id === successor.user.id, "The successor could not use the transferred community authority."); }



