import * as api from "@benchmark/reddit-api";
import typia from "typia";
import { authorizeDetailed, scenario } from "../../../helpers/RedditScenario";
import { page, refused, requireValue } from "../../../helpers/RequirementTest";

/**
 * Proves a moderator cannot revoke a peer moderator role.
 *
 * 1. Create the actors and prerequisite records used by test_api_moderator_peer_remove_refused.
 * 2. Execute test_api_moderator_peer_remove_refused's primary generated API operation for the documented scenario.
 * 3. Assert the returned business outcome and the public follow-up state when the requirement names one.
 */ 
export async function test_api_moderator_peer_remove_refused(connection: api.IConnection): Promise<void> {
  // Step 1: Create the actors and prerequisite records used by test_api_moderator_peer_remove_refused.
  // Step 2: Execute test_api_moderator_peer_remove_refused's primary generated API operation for the documented scenario.
  // Step 3: Assert the returned business outcome and the public follow-up state when the requirement names one.
  const state = await scenario(connection.host); const peer = await authorizeDetailed(connection.host); const firstAssignment = await api.functional.community.moderators.assignModerator(state.owner, state.community.id, state.memberUser.id); typia.assert(firstAssignment); if (!firstAssignment) throw new Error("Moderator setup did not report success."); const secondAssignment = await api.functional.community.moderators.assignModerator(state.member, state.community.id, peer.user.id); typia.assert(secondAssignment); if (!secondAssignment) throw new Error("Peer moderator setup did not report success."); if (!await refused(() => api.functional.community.moderators.removeModerator(state.member, state.community.id, peer.user.id))) throw new Error("A moderator removed a protected peer role.");
  const report = await api.functional.reports.report(state.owner, { postId: state.post.id, reason: "Peer role remains" });
  typia.assert(report);
  const queue = await api.functional.community.reports(peer.connection, state.community.id, page());
  typia.assert(queue);
  requireValue(queue.data.some((item) => item.id === report.id), "A refused peer removal changed the peer moderator's authority.");
}

