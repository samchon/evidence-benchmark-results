import * as api from "@benchmark/reddit-api";
import { useEffect, useState } from "react";
import {
  useMutation,
  useQuery,
  useQueryClient,
  queryOptions,
} from "@tanstack/react-query";

import {
  apiConnection,
  clearSession,
  restoreSession,
  saveSession,
} from "@/lib/client";

const invalidateAll = (queryClient: ReturnType<typeof useQueryClient>): void => {
  void queryClient.invalidateQueries();
};

/** Restores the persisted bearer session without flashing an anonymous state. */
export function useSession() {
  const [state, setState] = useState<"restoring" | "anonymous" | "authenticated">("restoring");
  useEffect(() => {
    const sync = () => setState(restoreSession() === null ? "anonymous" : "authenticated");
    sync();
    window.addEventListener("reddit-session-change", sync);
    return () => window.removeEventListener("reddit-session-change", sync);
  }, []);
  return state;
}

/**
 * Owns every authentication and account accessor used by the application.
 * @evidence {@link api.functional.auth.user.join} Registers an account and session.
 * @evidenceReview {@link api.functional.auth.user.join} Read the referenced SDK accessor and the complete hook body; verified the hook calls it through apiConnection and exposes the resulting query or mutation state.
 * @evidence {@link api.functional.auth.user.login} Starts a credentialed session.
 * @evidenceReview {@link api.functional.auth.user.login} Read the referenced SDK accessor and the complete hook body; verified the hook calls it through apiConnection and exposes the resulting query or mutation state.
 * @evidence {@link api.functional.auth.user.refresh} Renews the shared session.
 * @evidenceReview {@link api.functional.auth.user.refresh} Read the referenced SDK accessor and the complete hook body; verified the hook calls it through apiConnection and exposes the resulting query or mutation state.
 * @evidence {@link api.functional.auth.user.password} Changes the current password.
 * @evidenceReview {@link api.functional.auth.user.password} Read the referenced SDK accessor and the complete hook body; verified the hook calls it through apiConnection and exposes the resulting query or mutation state.
 * @evidence {@link api.functional.auth.user.session.logout} Revokes the current session.
 * @evidenceReview {@link api.functional.auth.user.session.logout} Read the referenced SDK accessor and the complete hook body; verified the hook calls it through apiConnection and exposes the resulting query or mutation state.
 * @evidence {@link api.functional.auth.user.sessions.logoutAll} Revokes every active session.
 * @evidenceReview {@link api.functional.auth.user.sessions.logoutAll} Read the referenced SDK accessor and the complete hook body; verified the hook calls it through apiConnection and exposes the resulting query or mutation state.
 * @evidence {@link api.functional.auth.user.recovery.request.recoveryRequest} Requests neutral recovery delivery.
 * @evidenceReview {@link api.functional.auth.user.recovery.request.recoveryRequest} Read the referenced SDK accessor and the complete hook body; verified the hook calls it through apiConnection and exposes the resulting query or mutation state.
 * @evidence {@link api.functional.auth.user.recovery.complete.recoveryComplete} Completes one-time recovery.
 * @evidenceReview {@link api.functional.auth.user.recovery.complete.recoveryComplete} Read the referenced SDK accessor and the complete hook body; verified the hook calls it through apiConnection and exposes the resulting query or mutation state.
 * @evidence {@link api.functional.auth.user.account._delete.erase} Permanently deletes the account.
 * @evidenceReview {@link api.functional.auth.user.account._delete.erase} Read the referenced SDK accessor and the complete hook body; verified the hook calls it through apiConnection and exposes the resulting query or mutation state.
 */
export function useAuth() {
  const queryClient = useQueryClient();
  const join = useMutation({
    mutationFn: (body: Parameters<typeof api.functional.auth.user.join>[1]) => api.functional.auth.user.join(apiConnection, body),
    onSuccess: (value) => saveSession(value.accessToken, value.refreshToken),
  });
  const login = useMutation({
    mutationFn: (body: Parameters<typeof api.functional.auth.user.login>[1]) => api.functional.auth.user.login(apiConnection, body),
    onSuccess: (value) => saveSession(value.accessToken, value.refreshToken),
  });
  const refresh = useMutation({
    mutationFn: (body: Parameters<typeof api.functional.auth.user.refresh>[1]) => api.functional.auth.user.refresh(apiConnection, body),
    onSuccess: (value) => saveSession(value.accessToken, value.refreshToken),
  });
  const password = useMutation({
    mutationFn: (body: Parameters<typeof api.functional.auth.user.password>[1]) => api.functional.auth.user.password(apiConnection, body),
    onSuccess: () => invalidateAll(queryClient),
  });
  const logout = useMutation({
    mutationFn: () => api.functional.auth.user.session.logout(apiConnection),
    onSuccess: () => { clearSession(); invalidateAll(queryClient); },
  });
  const logoutAll = useMutation({
    mutationFn: () => api.functional.auth.user.sessions.logoutAll(apiConnection),
    onSuccess: () => { clearSession(); invalidateAll(queryClient); },
  });
  const recoveryRequest = useMutation({
    mutationFn: (body: Parameters<typeof api.functional.auth.user.recovery.request.recoveryRequest>[1]) => api.functional.auth.user.recovery.request.recoveryRequest(apiConnection, body),
  });
  const recoveryComplete = useMutation({
    mutationFn: (body: Parameters<typeof api.functional.auth.user.recovery.complete.recoveryComplete>[1]) => api.functional.auth.user.recovery.complete.recoveryComplete(apiConnection, body),
    onSuccess: () => { clearSession(); invalidateAll(queryClient); },
  });
  const erase = useMutation({
    mutationFn: (body: Parameters<typeof api.functional.auth.user.account._delete.erase>[1]) => api.functional.auth.user.account._delete.erase(apiConnection, body),
    onSuccess: () => { clearSession(); invalidateAll(queryClient); },
  });
  return { join, login, refresh, password, logout, logoutAll, recoveryRequest, recoveryComplete, erase };
}

/** Reads the public or actor-owned profile by username.
 * @evidence {@link api.functional.user.username.at} Reads a profile by its stable username.
 * @evidenceReview {@link api.functional.user.username.at} Read the referenced SDK accessor and the complete hook body; verified the hook calls it through apiConnection and exposes the resulting query or mutation state.
 */
export function useProfile(username: string | undefined) {
  return useQuery(queryOptions({
    queryKey: ["reddit", "profile", username] as const,
    enabled: username !== undefined && username.length > 0,
    queryFn: () => api.functional.user.username.at(apiConnection, username ?? ""),
  }));
}

/** Owns profile mutation and its authored-list invalidation.
 * @evidence {@link api.functional.user.profile.update} Updates the authenticated profile.
 * @evidenceReview {@link api.functional.user.profile.update} Read the referenced SDK accessor and the complete hook body; verified the hook calls it through apiConnection and exposes the resulting query or mutation state.
 */
export function useProfileActions() {
  const queryClient = useQueryClient();
  const update = useMutation({
    mutationFn: (body: Parameters<typeof api.functional.user.profile.update>[1]) => api.functional.user.profile.update(apiConnection, body),
    onSuccess: () => invalidateAll(queryClient),
  });
  return { update };
}

/**
 * Owns community discovery.
 * @evidence {@link api.functional.community.index} Lists the public catalog.
 * @evidenceReview {@link api.functional.community.index} Read the referenced SDK accessor and the complete hook body; verified the hook calls it through apiConnection and exposes the resulting query or mutation state.
 */
export function useCommunities(request: api.IRedditCommunity.IRequest) {
  return useQuery(queryOptions({
    queryKey: ["reddit", "communities", request] as const,
    queryFn: () => api.functional.community.index(apiConnection, request),
  }));
}

/**
 * Reads one community detail.
 * @evidence {@link api.functional.community.at} Reads community detail.
 * @evidenceReview {@link api.functional.community.at} Read the referenced SDK accessor and the complete hook body; verified the hook calls it through apiConnection and exposes the resulting query or mutation state.
 */
export function useCommunity(communityId: string | undefined) {
  return useQuery(queryOptions({
    queryKey: ["reddit", "community", communityId] as const,
    enabled: communityId !== undefined,
    queryFn: () => api.functional.community.at(apiConnection, communityId ?? ""),
  }));
}

/**
 * Creates a community.
 * @evidence {@link api.functional.community.create} Creates a scoped community.
 * @evidenceReview {@link api.functional.community.create} Read the referenced SDK accessor and the complete hook body; verified the hook calls it through apiConnection and exposes the resulting query or mutation state.
 */
export function useCommunityActions() {
  const queryClient = useQueryClient();
  const create = useMutation({
    mutationFn: (body: Parameters<typeof api.functional.community.create>[1]) => api.functional.community.create(apiConnection, body),
    onSuccess: () => invalidateAll(queryClient),
  });
  return { create };
}

/**
 * Owns all subscription operations.
 * @evidence {@link api.functional.subscription.index} Lists current subscriptions.
 * @evidenceReview {@link api.functional.subscription.index} Read the referenced SDK accessor and the complete hook body; verified the hook calls it through apiConnection and exposes the resulting query or mutation state.
 * @evidence {@link api.functional.subscription.create} Subscribes to a community.
 * @evidenceReview {@link api.functional.subscription.create} Read the referenced SDK accessor and the complete hook body; verified the hook calls it through apiConnection and exposes the resulting query or mutation state.
 * @evidence {@link api.functional.subscription.erase} Ends a subscription.
 * @evidenceReview {@link api.functional.subscription.erase} Read the referenced SDK accessor and the complete hook body; verified the hook calls it through apiConnection and exposes the resulting query or mutation state.
 */
export function useSubscriptions(request: api.IPage.IRequest) {
  const queryClient = useQueryClient();
  const query = useQuery(queryOptions({
    queryKey: ["reddit", "subscriptions", request] as const,
    enabled: restoreSession() !== null,
    queryFn: () => api.functional.subscription.index(apiConnection, request),
  }));
  const create = useMutation({
    mutationFn: (communityId: string) => api.functional.subscription.create(apiConnection, communityId),
    onSuccess: () => invalidateAll(queryClient),
  });
  const erase = useMutation({
    mutationFn: (communityId: string) => api.functional.subscription.erase(apiConnection, communityId),
    onSuccess: () => invalidateAll(queryClient),
  });
  return { query, create, erase };
}

/**
 * Owns the three feed scopes and their shared continuation request.
 * @evidence {@link api.functional.feed.home} Reads the authenticated home feed.
 * @evidenceReview {@link api.functional.feed.home} Read the referenced SDK accessor and the complete hook body; verified the hook calls it through apiConnection and exposes the resulting query or mutation state.
 * @evidence {@link api.functional.feed.popular} Reads the public popular feed.
 * @evidenceReview {@link api.functional.feed.popular} Read the referenced SDK accessor and the complete hook body; verified the hook calls it through apiConnection and exposes the resulting query or mutation state.
 * @evidence {@link api.functional.feed.community} Reads one community feed.
 * @evidenceReview {@link api.functional.feed.community} Read the referenced SDK accessor and the complete hook body; verified the hook calls it through apiConnection and exposes the resulting query or mutation state.
 */
export function useFeed(kind: "home" | "popular" | "community", request: api.IRedditPost.IRequest, communityId?: string) {
  return useQuery(queryOptions({
    queryKey: ["reddit", "feed", kind, communityId, request] as const,
    queryFn: () => {
      if (kind === "home") return api.functional.feed.home(apiConnection, request);
      if (kind === "community") return api.functional.feed.community(apiConnection, communityId ?? "", request);
      return api.functional.feed.popular(apiConnection, request);
    },
  }));
}

/**
 * Owns post detail, creation, editing, and deletion.
 * @evidence {@link api.functional.post.community.create} Creates a subscribed post.
 * @evidenceReview {@link api.functional.post.community.create} Read the referenced SDK accessor and the complete hook body; verified the hook calls it through apiConnection and exposes the resulting query or mutation state.
 * @evidence {@link api.functional.post.at} Reads full post detail.
 * @evidenceReview {@link api.functional.post.at} Read the referenced SDK accessor and the complete hook body; verified the hook calls it through apiConnection and exposes the resulting query or mutation state.
 * @evidence {@link api.functional.post.update} Edits an authored post.
 * @evidenceReview {@link api.functional.post.update} Read the referenced SDK accessor and the complete hook body; verified the hook calls it through apiConnection and exposes the resulting query or mutation state.
 * @evidence {@link api.functional.post.erase} Deletes an authored post.
 * @evidenceReview {@link api.functional.post.erase} Read the referenced SDK accessor and the complete hook body; verified the hook calls it through apiConnection and exposes the resulting query or mutation state.
 */
export function usePost(postId: string | undefined) {
  const queryClient = useQueryClient();
  const query = useQuery(queryOptions({
    queryKey: ["reddit", "post", postId] as const,
    enabled: postId !== undefined,
    queryFn: () => api.functional.post.at(apiConnection, postId ?? ""),
  }));
  const create = useMutation({
    mutationFn: ({ communityId, body }: { communityId: string; body: Parameters<typeof api.functional.post.community.create>[2] }) => api.functional.post.community.create(apiConnection, communityId, body),
    onSuccess: () => invalidateAll(queryClient),
  });
  const update = useMutation({
    mutationFn: ({ id, body }: { id: string; body: Parameters<typeof api.functional.post.update>[2] }) => api.functional.post.update(apiConnection, id, body),
    onSuccess: () => invalidateAll(queryClient),
  });
  const erase = useMutation({
    mutationFn: (id: string) => api.functional.post.erase(apiConnection, id),
    onSuccess: () => invalidateAll(queryClient),
  });
  return { query, create, update, erase };
}

/**
 * Owns comment thread reads and authored comment mutations.
 * @evidence {@link api.functional.comment.post.create} Creates a top-level comment.
 * @evidenceReview {@link api.functional.comment.post.create} Read the referenced SDK accessor and the complete hook body; verified the hook calls it through apiConnection and exposes the resulting query or mutation state.
 * @evidence {@link api.functional.comment.post.index} Reads the recursive thread.
 * @evidenceReview {@link api.functional.comment.post.index} Read the referenced SDK accessor and the complete hook body; verified the hook calls it through apiConnection and exposes the resulting query or mutation state.
 * @evidence {@link api.functional.comment.reply} Creates a reply.
 * @evidenceReview {@link api.functional.comment.reply} Read the referenced SDK accessor and the complete hook body; verified the hook calls it through apiConnection and exposes the resulting query or mutation state.
 * @evidence {@link api.functional.comment.update} Edits authored comment text.
 * @evidenceReview {@link api.functional.comment.update} Read the referenced SDK accessor and the complete hook body; verified the hook calls it through apiConnection and exposes the resulting query or mutation state.
 * @evidence {@link api.functional.comment.erase} Deletes authored comment content.
 * @evidenceReview {@link api.functional.comment.erase} Read the referenced SDK accessor and the complete hook body; verified the hook calls it through apiConnection and exposes the resulting query or mutation state.
 */
export function useComments(postId: string | undefined, request: api.IRedditComment.IRequest) {
  const queryClient = useQueryClient();
  const query = useQuery(queryOptions({
    queryKey: ["reddit", "comments", postId, request] as const,
    enabled: postId !== undefined,
    queryFn: () => api.functional.comment.post.index(apiConnection, postId ?? "", request),
  }));
  const create = useMutation({
    mutationFn: ({ id, body }: { id: string; body: Parameters<typeof api.functional.comment.post.create>[2] }) => api.functional.comment.post.create(apiConnection, id, body),
    onSuccess: () => invalidateAll(queryClient),
  });
  const reply = useMutation({
    mutationFn: ({ id, body }: { id: string; body: Parameters<typeof api.functional.comment.reply>[2] }) => api.functional.comment.reply(apiConnection, id, body),
    onSuccess: () => invalidateAll(queryClient),
  });
  const update = useMutation({
    mutationFn: ({ id, body }: { id: string; body: Parameters<typeof api.functional.comment.update>[2] }) => api.functional.comment.update(apiConnection, id, body),
    onSuccess: () => invalidateAll(queryClient),
  });
  const erase = useMutation({
    mutationFn: (id: string) => api.functional.comment.erase(apiConnection, id),
    onSuccess: () => invalidateAll(queryClient),
  });
  return { query, create, reply, update, erase };
}

/** Owns post and comment vote transitions and removal.
 * @evidence {@link api.functional.vote.post.post} Records a post vote.
 * @evidenceReview {@link api.functional.vote.post.post} Read the referenced SDK accessor and the complete hook body; verified the hook calls it through apiConnection and exposes the resulting query or mutation state.
 * @evidence {@link api.functional.vote.post.erasePost} Removes a post vote.
 * @evidenceReview {@link api.functional.vote.post.erasePost} Read the referenced SDK accessor and the complete hook body; verified the hook calls it through apiConnection and exposes the resulting query or mutation state.
 * @evidence {@link api.functional.vote.comment.comment} Records a comment vote.
 * @evidenceReview {@link api.functional.vote.comment.comment} Read the referenced SDK accessor and the complete hook body; verified the hook calls it through apiConnection and exposes the resulting query or mutation state.
 * @evidence {@link api.functional.vote.comment.eraseComment} Removes a comment vote.
 * @evidenceReview {@link api.functional.vote.comment.eraseComment} Read the referenced SDK accessor and the complete hook body; verified the hook calls it through apiConnection and exposes the resulting query or mutation state.
 */
export function useVoting() {
  const queryClient = useQueryClient();
  const post = useMutation({
    mutationFn: ({ id, body }: { id: string; body: Parameters<typeof api.functional.vote.post.post>[2] }) => api.functional.vote.post.post(apiConnection, id, body),
    onSuccess: () => invalidateAll(queryClient),
  });
  const erasePost = useMutation({
    mutationFn: (id: string) => api.functional.vote.post.erasePost(apiConnection, id),
    onSuccess: () => invalidateAll(queryClient),
  });
  const comment = useMutation({
    mutationFn: ({ id, body }: { id: string; body: Parameters<typeof api.functional.vote.comment.comment>[2] }) => api.functional.vote.comment.comment(apiConnection, id, body),
    onSuccess: () => invalidateAll(queryClient),
  });
  const eraseComment = useMutation({
    mutationFn: (id: string) => api.functional.vote.comment.eraseComment(apiConnection, id),
    onSuccess: () => invalidateAll(queryClient),
  });
  return { post, erasePost, comment, eraseComment };
}

/**
 * Owns scoped moderation queues and actions.
 * @evidence {@link api.functional.community.moderation.bans} Lists active bans.
 * @evidenceReview {@link api.functional.community.moderation.bans} Read the referenced SDK accessor and the complete hook body; verified the hook calls it through apiConnection and exposes the resulting query or mutation state.
 * @evidence {@link api.functional.community.moderation.reports} Lists unresolved reports.
 * @evidenceReview {@link api.functional.community.moderation.reports} Read the referenced SDK accessor and the complete hook body; verified the hook calls it through apiConnection and exposes the resulting query or mutation state.
 * @evidence {@link api.functional.community.moderation.history} Reads resolved history.
 * @evidenceReview {@link api.functional.community.moderation.history} Read the referenced SDK accessor and the complete hook body; verified the hook calls it through apiConnection and exposes the resulting query or mutation state.
 * @evidence {@link api.functional.community.moderation.moderator.appoint} Appoints a moderator.
 * @evidenceReview {@link api.functional.community.moderation.moderator.appoint} Read the referenced SDK accessor and the complete hook body; verified the hook calls it through apiConnection and exposes the resulting query or mutation state.
 * @evidence {@link api.functional.community.moderation.moderator.removeModerator} Removes a moderator.
 * @evidenceReview {@link api.functional.community.moderation.moderator.removeModerator} Read the referenced SDK accessor and the complete hook body; verified the hook calls it through apiConnection and exposes the resulting query or mutation state.
 * @evidence {@link api.functional.community.moderation.ban.ban} Creates or preserves a ban.
 * @evidenceReview {@link api.functional.community.moderation.ban.ban} Read the referenced SDK accessor and the complete hook body; verified the hook calls it through apiConnection and exposes the resulting query or mutation state.
 * @evidence {@link api.functional.community.moderation.ban.unban} Ends a ban.
 * @evidenceReview {@link api.functional.community.moderation.ban.unban} Read the referenced SDK accessor and the complete hook body; verified the hook calls it through apiConnection and exposes the resulting query or mutation state.
 * @evidence {@link api.functional.community.moderation.post.deletePost} Deletes any scoped post.
 * @evidenceReview {@link api.functional.community.moderation.post.deletePost} Read the referenced SDK accessor and the complete hook body; verified the hook calls it through apiConnection and exposes the resulting query or mutation state.
 * @evidence {@link api.functional.community.moderation.comment.deleteComment} Deletes any scoped comment.
 * @evidenceReview {@link api.functional.community.moderation.comment.deleteComment} Read the referenced SDK accessor and the complete hook body; verified the hook calls it through apiConnection and exposes the resulting query or mutation state.
 * @evidence {@link api.functional.community.moderation.report.report} Submits a report.
 * @evidenceReview {@link api.functional.community.moderation.report.report} Read the referenced SDK accessor and the complete hook body; verified the hook calls it through apiConnection and exposes the resulting query or mutation state.
 * @evidence {@link api.functional.community.moderation.report.approve} Approves a report.
 * @evidenceReview {@link api.functional.community.moderation.report.approve} Read the referenced SDK accessor and the complete hook body; verified the hook calls it through apiConnection and exposes the resulting query or mutation state.
 * @evidence {@link api.functional.community.moderation.report.dismiss} Dismisses a report.
 * @evidenceReview {@link api.functional.community.moderation.report.dismiss} Read the referenced SDK accessor and the complete hook body; verified the hook calls it through apiConnection and exposes the resulting query or mutation state.
 */
export function useModeration(communityId: string | undefined, request: api.IPage.IRequest) {
  const queryClient = useQueryClient();
  const enabled = communityId !== undefined && restoreSession() !== null;
  const bans = useQuery(queryOptions({
    queryKey: ["reddit", "moderation", "bans", communityId, request] as const,
    enabled,
    queryFn: () => api.functional.community.moderation.bans(apiConnection, communityId ?? "", request),
  }));
  const reports = useQuery(queryOptions({
    queryKey: ["reddit", "moderation", "reports", communityId, request] as const,
    enabled,
    queryFn: () => api.functional.community.moderation.reports(apiConnection, communityId ?? "", request),
  }));
  const history = useQuery(queryOptions({
    queryKey: ["reddit", "moderation", "history", communityId, request] as const,
    enabled,
    queryFn: () => api.functional.community.moderation.history(apiConnection, communityId ?? "", request),
  }));
  const appoint = useMutation({
    mutationFn: ({ community, user }: { community: string; user: string }) => api.functional.community.moderation.moderator.appoint(apiConnection, community, user),
    onSuccess: () => invalidateAll(queryClient),
  });
  const removeModerator = useMutation({
    mutationFn: ({ community, user }: { community: string; user: string }) => api.functional.community.moderation.moderator.removeModerator(apiConnection, community, user),
    onSuccess: () => invalidateAll(queryClient),
  });
  const ban = useMutation({
    mutationFn: ({ community, user }: { community: string; user: string }) => api.functional.community.moderation.ban.ban(apiConnection, community, user),
    onSuccess: () => invalidateAll(queryClient),
  });
  const unban = useMutation({
    mutationFn: ({ community, user }: { community: string; user: string }) => api.functional.community.moderation.ban.unban(apiConnection, community, user),
    onSuccess: () => invalidateAll(queryClient),
  });
  const deletePost = useMutation({
    mutationFn: ({ community, post }: { community: string; post: string }) => api.functional.community.moderation.post.deletePost(apiConnection, community, post),
    onSuccess: () => invalidateAll(queryClient),
  });
  const deleteComment = useMutation({
    mutationFn: ({ community, comment }: { community: string; comment: string }) => api.functional.community.moderation.comment.deleteComment(apiConnection, community, comment),
    onSuccess: () => invalidateAll(queryClient),
  });
  const report = useMutation({
    mutationFn: ({ community, body }: { community: string; body: Parameters<typeof api.functional.community.moderation.report.report>[2] }) => api.functional.community.moderation.report.report(apiConnection, community, body),
    onSuccess: () => invalidateAll(queryClient),
  });
  const approve = useMutation({
    mutationFn: ({ community, report }: { community: string; report: string }) => api.functional.community.moderation.report.approve(apiConnection, community, report),
    onSuccess: () => invalidateAll(queryClient),
  });
  const dismiss = useMutation({
    mutationFn: ({ community, report }: { community: string; report: string }) => api.functional.community.moderation.report.dismiss(apiConnection, community, report),
    onSuccess: () => invalidateAll(queryClient),
  });
  return { bans, reports, history, appoint, removeModerator, ban, unban, deletePost, deleteComment, report, approve, dismiss };
}

/** Keeps the backend health accessor behind the shared client boundary.
 * @evidence {@link api.functional.health.get} Confirms backend availability.
 * @evidenceReview {@link api.functional.health.get} Read the referenced SDK accessor and the complete hook body; verified the hook calls it through apiConnection and exposes the resulting query or mutation state.
 */
export function useHealth() {
  return useQuery(queryOptions({
    queryKey: ["reddit", "health"] as const,
    queryFn: () => api.functional.health.get(apiConnection),
  }));
}
