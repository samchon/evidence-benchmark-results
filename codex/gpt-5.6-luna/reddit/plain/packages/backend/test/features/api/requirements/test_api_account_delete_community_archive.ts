import * as api from "@benchmark/reddit-api";
import typia from "typia";
import { authorizeDetailed, image } from "../../../helpers/RedditScenario";
import { page, requireValue } from "../../../helpers/RequirementTest";

/**
 * Proves owner deletion archives a community with no eligible successor.
 *
 * 1. Create the actors and prerequisite records used by test_api_account_delete_community_archive.
 * 2. Execute test_api_account_delete_community_archive's primary generated API operation for the documented scenario.
 * 3. Assert the returned business outcome and the public follow-up state when the requirement names one.
 */ 
export async function test_api_account_delete_community_archive(connection: api.IConnection): Promise<void> {
  // Step 1: Create the actors and prerequisite records used by test_api_account_delete_community_archive.
  // Step 2: Execute test_api_account_delete_community_archive's primary generated API operation for the documented scenario.
  // Step 3: Assert the returned business outcome and the public follow-up state when the requirement names one.
  const owner = await authorizeDetailed(connection.host); const community = await api.functional.communities.createCommunity(owner.connection, { name: `archive_${Date.now().toString(36)}`, description: "Archive community", icon: image() });
  typia.assert(community); const deleted = await api.functional.auth.account._delete.deleteAccount(owner.connection, { password: "password-123" }); typia.assert(deleted); requireValue(deleted, "Account deletion did not report success."); const catalog = await api.functional.communities.communities({ host: connection.host }, { ...page(), search: community.name });
  typia.assert(catalog); const archived = catalog.data.find((item) => item.id === community.id); requireValue(archived?.status === "archived" && archived.owner === null && archived.subscriberCount === 0, "Ownerless community was not preserved as a public archive."); }



