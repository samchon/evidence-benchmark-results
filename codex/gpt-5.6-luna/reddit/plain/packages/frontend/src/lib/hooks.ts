import { functional } from "@benchmark/reddit-api";
import type {
  IAuth,
  IComment,
  ICommunity,
  ICommunityCreate,
  ICommunityRequest,
  IPage,
  IPost,
  IProfileRequest,
  IProfileUpdate,
  IReportCreate,
  ISubscriptionRequest,
  IVoteRequest,
} from "@benchmark/reddit-api";
import {
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { apiConnection } from "@/lib/client";
import { useSession } from "@/lib/session";

export function errorMessage(error: unknown): string {
  const readable = (message: string): string => {
    try {
      const parsed: unknown = JSON.parse(message);
      if (Array.isArray(parsed)) {
        const messages = parsed.flatMap((item) =>
          typeof item === "object" && item !== null && "message" in item && typeof item.message === "string"
            ? [item.message]
            : [],
        );
        if (messages.length > 0) return messages.join(" ");
      }
    } catch {
      // Non-JSON server messages are already readable.
    }
    return message;
  };
  if (error instanceof Error) return readable(error.message);
  if (typeof error === "object" && error !== null && "message" in error) {
    const message = error.message;
    if (typeof message === "string") return readable(message);
  }
  return "The request could not be completed. Please try again.";
}

export function useHealth() {
  return useQuery(
    queryOptions({
      queryKey: ["health"],
      queryFn: () => functional.health.get(apiConnection),
      staleTime: 60_000,
    }),
  );
}

export function useAuthActions() {
  const { signIn, signOut } = useSession();
  const queryClient = useQueryClient();
  const join = useMutation({
    mutationFn: (body: IAuth.IJoin) => functional.auth.join(apiConnection, body),
    onSuccess: signIn,
  });
  const login = useMutation({
    mutationFn: (body: IAuth.ILogin) =>
      functional.auth.login(apiConnection, body),
    onSuccess: signIn,
  });
  const refresh = useMutation({
    mutationFn: (body: IAuth.IRefresh) =>
      functional.auth.refresh(apiConnection, body),
    onSuccess: signIn,
  });
  const logout = useMutation({
    mutationFn: () => functional.auth.logout(apiConnection),
    onSuccess: () => {
      signOut();
      void queryClient.clear();
    },
  });
  const logoutAll = useMutation({
    mutationFn: () => functional.auth.logout_all.logoutAll(apiConnection),
    onSuccess: () => {
      signOut();
      void queryClient.clear();
    },
  });
  const password = useMutation({
    mutationFn: (body: IAuth.IPassword) =>
      functional.auth.password(apiConnection, body),
  });
  const recoveryRequest = useMutation({
    mutationFn: (body: IAuth.IRecoveryRequest) =>
      functional.auth.recovery.request.recoveryRequest(apiConnection, body),
  });
  const recoveryComplete = useMutation({
    mutationFn: (body: IAuth.IRecoveryComplete) =>
      functional.auth.recovery.complete.recoveryComplete(apiConnection, body),
    onSuccess: () => {
      signOut();
      void queryClient.clear();
    },
  });
  const deleteAccount = useMutation({
    mutationFn: (passwordValue: string) =>
      functional.auth.account._delete.deleteAccount(apiConnection, {
        password: passwordValue,
      }),
    onSuccess: () => {
      signOut();
      void queryClient.clear();
    },
  });
  return {
    join,
    login,
    refresh,
    logout,
    logoutAll,
    password,
    recoveryRequest,
    recoveryComplete,
    deleteAccount,
  };
}

export function useProfileQuery(username: string, request: IProfileRequest = {}) {
  return useQuery(
    queryOptions({
      queryKey: ["profile", username, request],
      queryFn: () =>
        functional.profile.profile(apiConnection, username, request),
      enabled: username.length > 0,
    }),
  );
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: IProfileUpdate) =>
      functional.profile.updateProfile(apiConnection, body),
    onSuccess: (profile) => {
      void queryClient.invalidateQueries({ queryKey: ["profile", profile.username] });
    },
  });
}

export function useCommunities(request: ICommunityRequest = {}) {
  return useQuery(
    queryOptions({
      queryKey: ["communities", request],
      queryFn: () => functional.communities.communities(apiConnection, request),
    }),
  );
}

export function useCreateCommunity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: ICommunityCreate) =>
      functional.communities.createCommunity(apiConnection, body),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["communities"] }),
  });
}

export function useSubscriptions(request: ISubscriptionRequest = {}) {
  const { session } = useSession();
  return useQuery(
    queryOptions({
      queryKey: ["subscriptions", session?.user.id, request],
      queryFn: () => functional.subscriptions(apiConnection, request),
      enabled: session !== null,
    }),
  );
}

export function useSubscriptionActions() {
  const queryClient = useQueryClient();
  const subscribe = useMutation({
    mutationFn: (communityId: string) =>
      functional.community.subscribe.subscribe(apiConnection, communityId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["communities"] });
      void queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
      void queryClient.invalidateQueries({ queryKey: ["feed"] });
    },
  });
  const unsubscribe = useMutation({
    mutationFn: (communityId: string) =>
      functional.community.subscribe.unsubscribe(apiConnection, communityId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["communities"] });
      void queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
      void queryClient.invalidateQueries({ queryKey: ["feed"] });
    },
  });
  return { subscribe, unsubscribe };
}

export function useFeed(kind: "home" | "popular", request: IPost.IRequest = {}) {
  const { session } = useSession();
  return useQuery(
    queryOptions({
      queryKey: ["feed", kind, session?.user.id, request],
      queryFn: () =>
        kind === "home"
          ? functional.feed.home.homeFeed(apiConnection, request)
          : functional.feed.popular.popularFeed(apiConnection, request),
      enabled: kind === "popular" || session !== null,
    }),
  );
}

export function useCommunityFeed(communityId: string, request: IPost.IRequest = {}) {
  return useQuery(
    queryOptions({
      queryKey: ["community-feed", communityId, request],
      queryFn: () =>
        functional.community.feed.communityFeed(
          apiConnection,
          communityId,
          request,
        ),
      enabled: communityId.length > 0,
    }),
  );
}

export function usePost(postId: string) {
  return useQuery(
    queryOptions({
      queryKey: ["post", postId],
      queryFn: () => functional.post.post(apiConnection, postId),
      enabled: postId.length > 0,
    }),
  );
}

export function usePostComments(postId: string, request: IComment.IRequest = {}) {
  return useQuery(
    queryOptions({
      queryKey: ["comments", postId, request],
      queryFn: () => functional.post.comments(apiConnection, postId, request),
      enabled: postId.length > 0,
    }),
  );
}

export function usePostActions() {
  const queryClient = useQueryClient();
  const create = useMutation({
    mutationFn: (body: IPost.ICreate) =>
      functional.posts.createPost(apiConnection, body),
    onSuccess: (post) => {
      queryClient.setQueryData(["post", post.id], post);
      void queryClient.invalidateQueries({ queryKey: ["feed"] });
      void queryClient.invalidateQueries({ queryKey: ["community-feed", post.community.id] });
      void queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
  const update = useMutation({
    mutationFn: (input: { id: string; body: IPost.IUpdate }) =>
      functional.post.updatePost(apiConnection, input.id, input.body),
    onSuccess: (post) => {
      queryClient.setQueryData(["post", post.id], post);
      void queryClient.invalidateQueries({ queryKey: ["feed"] });
      void queryClient.invalidateQueries({ queryKey: ["community-feed"] });
      void queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
  const deleteOwn = useMutation({
    mutationFn: (id: string) => functional.post.deleteOwnPost(apiConnection, id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["feed"] });
      void queryClient.invalidateQueries({ queryKey: ["community-feed"] });
      void queryClient.invalidateQueries({ queryKey: ["post"] });
      void queryClient.invalidateQueries({ queryKey: ["comments"] });
      void queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
  const deleteModerated = useMutation({
    mutationFn: (id: string) =>
      functional.moderation.post.deleteModeratedPost(apiConnection, id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["feed"] });
      void queryClient.invalidateQueries({ queryKey: ["community-feed"] });
      void queryClient.invalidateQueries({ queryKey: ["post"] });
      void queryClient.invalidateQueries({ queryKey: ["comments"] });
      void queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
  return { create, update, deleteOwn, deleteModerated };
}

export function useCommentActions() {
  const queryClient = useQueryClient();
  const create = useMutation({
    mutationFn: (body: IComment.ICreate) =>
      functional.comments.createComment(apiConnection, body),
    onSuccess: (_comment, variables) => {
      void queryClient.invalidateQueries({ queryKey: ["comments", variables.postId] });
      void queryClient.invalidateQueries({ queryKey: ["post", variables.postId] });
      void queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
  const update = useMutation({
    mutationFn: (input: { id: string; body: IComment.IUpdate }) =>
      functional.comment.updateComment(apiConnection, input.id, input.body),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["comments"] });
      void queryClient.invalidateQueries({ queryKey: ["post"] });
      void queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
  const deleteOwn = useMutation({
    mutationFn: (id: string) =>
      functional.comment.deleteOwnComment(apiConnection, id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["comments"] });
      void queryClient.invalidateQueries({ queryKey: ["post"] });
      void queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
  const deleteModerated = useMutation({
    mutationFn: (id: string) =>
      functional.moderation.comment.deleteModeratedComment(apiConnection, id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["comments"] });
      void queryClient.invalidateQueries({ queryKey: ["post"] });
      void queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
  return { create, update, deleteOwn, deleteModerated };
}

export function useVoteActions() {
  const queryClient = useQueryClient();
  const vote = useMutation({
    mutationFn: (body: IVoteRequest) =>
      functional.votes.vote(apiConnection, body),
    onSuccess: (result) => {
      if (result.postId !== null) void queryClient.invalidateQueries({ queryKey: ["post", result.postId] });
      if (result.commentId !== null) void queryClient.invalidateQueries({ queryKey: ["comments"] });
      void queryClient.invalidateQueries({ queryKey: ["feed"] });
      void queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
  const removePostVote = useMutation({
    mutationFn: (postId: string) =>
      functional.votes.post.removePostVote(apiConnection, postId),
    onSuccess: (_result, postId) => {
      void queryClient.invalidateQueries({ queryKey: ["post", postId] });
      void queryClient.invalidateQueries({ queryKey: ["feed"] });
      void queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
  const removeCommentVote = useMutation({
    mutationFn: (commentId: string) =>
      functional.votes.comment.removeCommentVote(apiConnection, commentId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["comments"] });
      void queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
  return { vote, removePostVote, removeCommentVote };
}

export function useReportActions() {
  const queryClient = useQueryClient();
  const report = useMutation({
    mutationFn: (body: IReportCreate) =>
      functional.reports.report(apiConnection, body),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["reports"] });
    },
  });
  return { report };
}

export function useModerationQueries(communityId: string, request: IPage.IRequest = {}) {
  const { session } = useSession();
  const enabled = communityId.length > 0 && session !== null;
  const reports = useQuery(
    queryOptions({
      queryKey: ["reports", session?.user.id, communityId, request],
      queryFn: () =>
        functional.community.reports(apiConnection, communityId, request),
      enabled,
    }),
  );
  const bans = useQuery(
    queryOptions({
      queryKey: ["bans", session?.user.id, communityId, request],
      queryFn: () =>
        functional.community.bans.banned(apiConnection, communityId, request),
      enabled,
    }),
  );
  const history = useQuery(
    queryOptions({
      queryKey: ["moderation-history", session?.user.id, communityId, request],
      queryFn: () =>
        functional.community.moderation_history.history(
          apiConnection,
          communityId,
          request,
        ),
      enabled,
    }),
  );
  return { reports, bans, history };
}

export function useModerationActions() {
  const queryClient = useQueryClient();
  const invalidate = async (): Promise<void> => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["reports"] }),
      queryClient.invalidateQueries({ queryKey: ["bans"] }),
      queryClient.invalidateQueries({ queryKey: ["moderation-history"] }),
      queryClient.invalidateQueries({ queryKey: ["communities"] }),
      queryClient.invalidateQueries({ queryKey: ["feed"] }),
      queryClient.invalidateQueries({ queryKey: ["community-feed"] }),
      queryClient.invalidateQueries({ queryKey: ["post"] }),
      queryClient.invalidateQueries({ queryKey: ["comments"] }),
      queryClient.invalidateQueries({ queryKey: ["profile"] }),
    ]);
  };
  const approve = useMutation({
    mutationFn: (id: string) =>
      functional.report.approve.approveReport(apiConnection, id),
    onSuccess: invalidate,
  });
  const dismiss = useMutation({
    mutationFn: (id: string) =>
      functional.report.dismiss.dismissReport(apiConnection, id),
    onSuccess: invalidate,
  });
  const ban = useMutation({
    mutationFn: (input: { communityId: string; userId: string }) =>
      functional.community.bans.ban(
        apiConnection,
        input.communityId,
        input.userId,
      ),
    onSuccess: invalidate,
  });
  const unban = useMutation({
    mutationFn: (input: { communityId: string; userId: string }) =>
      functional.community.bans.unban(
        apiConnection,
        input.communityId,
        input.userId,
      ),
    onSuccess: invalidate,
  });
  const assignModerator = useMutation({
    mutationFn: (input: { communityId: string; userId: string }) =>
      functional.community.moderators.assignModerator(
        apiConnection,
        input.communityId,
        input.userId,
      ),
    onSuccess: invalidate,
  });
  const removeModerator = useMutation({
    mutationFn: (input: { communityId: string; userId: string }) =>
      functional.community.moderators.removeModerator(
        apiConnection,
        input.communityId,
        input.userId,
      ),
    onSuccess: invalidate,
  });
  return { ban, unban, assignModerator, removeModerator, approve, dismiss };
}

export type PageRequest = IPage.IRequest;
