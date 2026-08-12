import * as api from "@benchmark/reddit-api";
import typia from "typia";
import { authorize, scenario } from "../../../helpers/RedditScenario";
import { requireValue } from "../../../helpers/RequirementTest";

/**
 * Proves commenting remains available to an authenticated non-subscriber.
 *
 * 1. Create the actors and prerequisite records used by test_api_participation_non_subscriber_comment.
 * 2. Execute test_api_participation_non_subscriber_comment's primary generated API operation for the documented scenario.
 * 3. Assert the returned business outcome and the public follow-up state when the requirement names one.
 */ 
export async function test_api_participation_non_subscriber_comment(connection: api.IConnection): Promise<void> {
  // Step 1: Create the actors and prerequisite records used by test_api_participation_non_subscriber_comment.
  // Step 2: Execute test_api_participation_non_subscriber_comment's primary generated API operation for the documented scenario.
  // Step 3: Assert the returned business outcome and the public follow-up state when the requirement names one.
  const state = await scenario(connection.host); const visitor = await authorize(connection.host); const comment = await api.functional.comments.createComment(visitor, { postId: state.post.id, text: "Non-subscriber comment" });
  typia.assert(comment); requireValue(comment.text === "Non-subscriber comment", "A non-subscriber could not comment on available content."); const thread = await api.functional.post.comments({ host: connection.host }, state.post.id, { sort: "best" });
  typia.assert(thread); requireValue(thread.data.some((item) => item.id === comment.id && item.text === "Non-subscriber comment"), "A non-subscriber comment was not retained in the public thread."); }



