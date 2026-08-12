import * as api from "@benchmark/todo-api";
import { queryOptions, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { apiConnection } from "@/lib/client";
import { useSession } from "@/lib/auth/session";

const profileKey = ["todo", "profile"] as const;
const profileOptions = () =>
  queryOptions({
    queryKey: profileKey,
    queryFn: () => api.functional.todo.user.profile.view.at(apiConnection),
  });

/**
 * Reads the authenticated user's private profile.
 * @evidence {@link api.functional.todo.user.profile.view.at} Calls the generated private profile view operation.
 * @evidenceReview {@link api.functional.todo.user.profile.view.at} Read the generated SDK accessor and inspected this hook query or mutation plus its profile-cache update.
 */
export function useProfile() {
  const session = useSession();
  return useQuery({
    ...profileOptions(),
    enabled: session.status === "authenticated",
  });
}

/**
 * Replaces only the authenticated user's display name.
 * @evidence {@link api.functional.todo.user.profile.update_operation.update} Calls the generated display-name update operation and refreshes the profile query.
 * @evidenceReview {@link api.functional.todo.user.profile.update_operation.update} Read the generated SDK accessor and inspected this hook query or mutation plus its profile-cache update.
 */
export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: api.ITodoProfile.IUpdate) =>
      api.functional.todo.user.profile.update_operation.update(apiConnection, body),
    onSuccess: (profile) => {
      queryClient.setQueryData(profileKey, profile);
    },
  });
}
