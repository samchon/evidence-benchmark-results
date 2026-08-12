import * as api from "@benchmark/reddit-api";
import typia from "typia";
import { scenario } from "../../../helpers/RedditScenario";
import { requireValue } from "../../../helpers/RequirementTest";

/**
 * Proves an author can edit only title and same-type payload.
 *
 * 1. Create the actors and prerequisite records used by test_api_post_update.
 * 2. Execute test_api_post_update's primary generated API operation for the documented scenario.
 * 3. Assert the returned business outcome and the public follow-up state when the requirement names one.
 */ 
export async function test_api_post_update(connection: api.IConnection): Promise<void> {
  // Step 1: Create the actors and prerequisite records used by test_api_post_update.
  // Step 2: Execute test_api_post_update's primary generated API operation for the documented scenario.
  // Step 3: Assert the returned business outcome and the public follow-up state when the requirement names one.
  const state = await scenario(connection.host); const result = await api.functional.post.updatePost(state.member, state.post.id, { title: "Edited title", text: "Edited body" });
  typia.assert(result); requireValue(result.id === state.post.id && result.title === "Edited title" && result.text === "Edited body" && result.createdAt === state.post.createdAt, "Post update did not preserve identity and persist editable fields."); const detail = await api.functional.post.post({ host: connection.host }, state.post.id);
  typia.assert(detail); requireValue(detail.title === "Edited title" && detail.text === "Edited body", "Edited post was not retained by public post detail."); }




