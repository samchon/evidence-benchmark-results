import * as api from "@benchmark/reddit-api";
import typia from "typia";
import { authorizeDetailed, scenario } from "../../../helpers/RedditScenario";
import { page, refused, requireValue } from "../../../helpers/RequirementTest";

/**
 * Proves the owner can revoke a peer moderator role.
 *
 * 1. Create the actors and prerequisite records used by test_api_moderator_peer_remove_owner.
 * 2. Execute test_api_moderator_peer_remove_owner's primary generated API operation for the documented scenario.
 * 3. Assert the returned business outcome and the public follow-up state when the requirement names one.
 */ 
export async function test_api_moderator_peer_remove_owner(connection: api.IConnection): Promise<void> {
  // Step 1: Create the actors and prerequisite records used by test_api_moderator_peer_remove_owner.
  // Step 2: Execute test_api_moderator_peer_remove_owner's primary generated API operation for the documented scenario.
  // Step 3: Assert the returned business outcome and the public follow-up state when the requirement names one.
  const state = await scenario(connection.host); const peer = await authorizeDetailed(connection.host); const assigned = await api.functional.community.moderators.assignModerator(state.owner, state.community.id, state.memberUser.id); typia.assert(assigned); requireValue(assigned, "Owner could not appoint the first moderator."); const peerAssigned = await api.functional.community.moderators.assignModerator(state.member, state.community.id, peer.user.id); typia.assert(peerAssigned); requireValue(peerAssigned, "A moderator could not appoint the peer."); const report = await api.functional.reports.report(state.owner, { postId: state.post.id, reason: "Role removal proof" }); typia.assert(report); const result = await api.functional.community.moderators.removeModerator(state.owner, state.community.id, peer.user.id); typia.assert(result); requireValue(result, "The owner could not revoke the peer moderator role."); if (!await refused(() => api.functional.community.reports(peer.connection, state.community.id, page()))) throw new Error("Revoked peer authority still exposed the private queue."); const ownerQueue = await api.functional.community.reports(state.owner, state.community.id, page());
  typia.assert(ownerQueue); requireValue(ownerQueue.data.some((report) => report.reason === "Role removal proof"), "Role removal changed unrelated private report state."); }



