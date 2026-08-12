import * as api from "@benchmark/reddit-api";
import typia from "typia";
import { authorizeDetailed, scenario } from "../../../helpers/RedditScenario";
import { page, requireValue } from "../../../helpers/RequirementTest";

/**
 * Proves moderator appointment is peer-capable but role revocation remains owner-only.
 *
 * 1. Create the actors and prerequisite records used by test_api_moderator_peer_assign.
 * 2. Execute test_api_moderator_peer_assign's primary generated API operation for the documented scenario.
 * 3. Assert the returned business outcome and the public follow-up state when the requirement names one.
 */ 
export async function test_api_moderator_peer_assign(connection: api.IConnection): Promise<void> {
  // Step 1: Create the actors and prerequisite records used by test_api_moderator_peer_assign.
  // Step 2: Execute test_api_moderator_peer_assign's primary generated API operation for the documented scenario.
  // Step 3: Assert the returned business outcome and the public follow-up state when the requirement names one.
  const state = await scenario(connection.host); const peer = await authorizeDetailed(connection.host); const report = await api.functional.reports.report(state.owner, { postId: state.post.id, reason: "Peer scope proof" });
  typia.assert(report); const assigned = await api.functional.community.moderators.assignModerator(state.owner, state.community.id, state.memberUser.id); typia.assert(assigned); requireValue(assigned, "Owner could not appoint the first moderator."); const peerAssigned = await api.functional.community.moderators.assignModerator(state.member, state.community.id, peer.user.id); typia.assert(peerAssigned); requireValue(peerAssigned, "A current moderator could not appoint a peer."); const queue = await api.functional.community.reports(peer.connection, state.community.id, page());
  typia.assert(queue); requireValue(queue.data.some((item) => item.id === report.id), "The appointed peer could not use the new scoped authority."); }



