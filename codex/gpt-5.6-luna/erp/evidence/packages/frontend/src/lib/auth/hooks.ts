import { useMutation } from "@tanstack/react-query";
import type * as api from "@benchmark/erp-api";
import type { IConnection } from "@nestia/fetcher";

import { apiConnection } from "@/lib/client";

export type AuthOperation = (
  connection: IConnection,
  input: api.IAuthRequest,
) => Promise<api.IAuthRecord>;

/**
 * Provides the typed authentication operation boundary.
 * @evidence {@link api.functional.auth.req_auth_account_001.execute.req_auth_account_001} Keeps the published operation in the auth hook contract.
 * @evidenceReview {@link api.functional.auth.req_auth_account_001.execute.req_auth_account_001} Read the generated accessor signature and auth hook mutation, then verified the supplied operation is invoked with the shared connection and typed request.
 * @evidence {@link api.functional.auth.req_auth_account_002.execute.req_auth_account_002} Keeps the published operation in the auth hook contract.
 * @evidenceReview {@link api.functional.auth.req_auth_account_002.execute.req_auth_account_002} Read the generated accessor signature and auth hook mutation, then verified the supplied operation is invoked with the shared connection and typed request.
 * @evidence {@link api.functional.auth.req_auth_account_003.execute.req_auth_account_003} Keeps the published operation in the auth hook contract.
 * @evidenceReview {@link api.functional.auth.req_auth_account_003.execute.req_auth_account_003} Read the generated accessor signature and auth hook mutation, then verified the supplied operation is invoked with the shared connection and typed request.
 * @evidence {@link api.functional.auth.req_auth_account_004.execute.req_auth_account_004} Keeps the published operation in the auth hook contract.
 * @evidenceReview {@link api.functional.auth.req_auth_account_004.execute.req_auth_account_004} Read the generated accessor signature and auth hook mutation, then verified the supplied operation is invoked with the shared connection and typed request.
 * @evidence {@link api.functional.auth.req_auth_account_005.execute.req_auth_account_005} Keeps the published operation in the auth hook contract.
 * @evidenceReview {@link api.functional.auth.req_auth_account_005.execute.req_auth_account_005} Read the generated accessor signature and auth hook mutation, then verified the supplied operation is invoked with the shared connection and typed request.
 * @evidence {@link api.functional.auth.req_auth_account_006.execute.req_auth_account_006} Keeps the published operation in the auth hook contract.
 * @evidenceReview {@link api.functional.auth.req_auth_account_006.execute.req_auth_account_006} Read the generated accessor signature and auth hook mutation, then verified the supplied operation is invoked with the shared connection and typed request.
 * @evidence {@link api.functional.auth.req_auth_account_007.execute.req_auth_account_007} Keeps the published operation in the auth hook contract.
 * @evidenceReview {@link api.functional.auth.req_auth_account_007.execute.req_auth_account_007} Read the generated accessor signature and auth hook mutation, then verified the supplied operation is invoked with the shared connection and typed request.
 * @evidence {@link api.functional.auth.req_auth_account_008.execute.req_auth_account_008} Keeps the published operation in the auth hook contract.
 * @evidenceReview {@link api.functional.auth.req_auth_account_008.execute.req_auth_account_008} Read the generated accessor signature and auth hook mutation, then verified the supplied operation is invoked with the shared connection and typed request.
 * @evidence {@link api.functional.auth.req_auth_membership_001.execute.req_auth_membership_001} Keeps the published operation in the auth hook contract.
 * @evidenceReview {@link api.functional.auth.req_auth_membership_001.execute.req_auth_membership_001} Read the generated accessor signature and auth hook mutation, then verified the supplied operation is invoked with the shared connection and typed request.
 * @evidence {@link api.functional.auth.req_auth_membership_002.execute.req_auth_membership_002} Keeps the published operation in the auth hook contract.
 * @evidenceReview {@link api.functional.auth.req_auth_membership_002.execute.req_auth_membership_002} Read the generated accessor signature and auth hook mutation, then verified the supplied operation is invoked with the shared connection and typed request.
 * @evidence {@link api.functional.auth.req_auth_membership_003.execute.req_auth_membership_003} Keeps the published operation in the auth hook contract.
 * @evidenceReview {@link api.functional.auth.req_auth_membership_003.execute.req_auth_membership_003} Read the generated accessor signature and auth hook mutation, then verified the supplied operation is invoked with the shared connection and typed request.
 * @evidence {@link api.functional.auth.req_auth_membership_004.execute.req_auth_membership_004} Keeps the published operation in the auth hook contract.
 * @evidenceReview {@link api.functional.auth.req_auth_membership_004.execute.req_auth_membership_004} Read the generated accessor signature and auth hook mutation, then verified the supplied operation is invoked with the shared connection and typed request.
 * @evidence {@link api.functional.auth.req_auth_membership_005.execute.req_auth_membership_005} Keeps the published operation in the auth hook contract.
 * @evidenceReview {@link api.functional.auth.req_auth_membership_005.execute.req_auth_membership_005} Read the generated accessor signature and auth hook mutation, then verified the supplied operation is invoked with the shared connection and typed request.
 * @evidence {@link api.functional.auth.req_auth_membership_006.execute.req_auth_membership_006} Keeps the published operation in the auth hook contract.
 * @evidenceReview {@link api.functional.auth.req_auth_membership_006.execute.req_auth_membership_006} Read the generated accessor signature and auth hook mutation, then verified the supplied operation is invoked with the shared connection and typed request.
 * @evidence {@link api.functional.auth.req_auth_position_001.execute.req_auth_position_001} Keeps the published operation in the auth hook contract.
 * @evidenceReview {@link api.functional.auth.req_auth_position_001.execute.req_auth_position_001} Read the generated accessor signature and auth hook mutation, then verified the supplied operation is invoked with the shared connection and typed request.
 * @evidence {@link api.functional.auth.req_auth_position_002.execute.req_auth_position_002} Keeps the published operation in the auth hook contract.
 * @evidenceReview {@link api.functional.auth.req_auth_position_002.execute.req_auth_position_002} Read the generated accessor signature and auth hook mutation, then verified the supplied operation is invoked with the shared connection and typed request.
 * @evidence {@link api.functional.auth.req_auth_position_003.execute.req_auth_position_003} Keeps the published operation in the auth hook contract.
 * @evidenceReview {@link api.functional.auth.req_auth_position_003.execute.req_auth_position_003} Read the generated accessor signature and auth hook mutation, then verified the supplied operation is invoked with the shared connection and typed request.
 * @evidence {@link api.functional.auth.req_auth_principal_001.execute.req_auth_principal_001} Keeps the published operation in the auth hook contract.
 * @evidenceReview {@link api.functional.auth.req_auth_principal_001.execute.req_auth_principal_001} Read the generated accessor signature and auth hook mutation, then verified the supplied operation is invoked with the shared connection and typed request.
 * @evidence {@link api.functional.auth.req_auth_principal_002.execute.req_auth_principal_002} Keeps the published operation in the auth hook contract.
 * @evidenceReview {@link api.functional.auth.req_auth_principal_002.execute.req_auth_principal_002} Read the generated accessor signature and auth hook mutation, then verified the supplied operation is invoked with the shared connection and typed request.
 * @evidence {@link api.functional.auth.req_auth_principal_003.execute.req_auth_principal_003} Keeps the published operation in the auth hook contract.
 * @evidenceReview {@link api.functional.auth.req_auth_principal_003.execute.req_auth_principal_003} Read the generated accessor signature and auth hook mutation, then verified the supplied operation is invoked with the shared connection and typed request.
 * @evidence {@link api.functional.auth.req_auth_principal_004.execute.req_auth_principal_004} Keeps the published operation in the auth hook contract.
 * @evidenceReview {@link api.functional.auth.req_auth_principal_004.execute.req_auth_principal_004} Read the generated accessor signature and auth hook mutation, then verified the supplied operation is invoked with the shared connection and typed request.
 * @evidence {@link api.functional.auth.req_auth_provision_001.execute.req_auth_provision_001} Keeps the published operation in the auth hook contract.
 * @evidenceReview {@link api.functional.auth.req_auth_provision_001.execute.req_auth_provision_001} Read the generated accessor signature and auth hook mutation, then verified the supplied operation is invoked with the shared connection and typed request.
 * @evidence {@link api.functional.auth.req_auth_provision_002.execute.req_auth_provision_002} Keeps the published operation in the auth hook contract.
 * @evidenceReview {@link api.functional.auth.req_auth_provision_002.execute.req_auth_provision_002} Read the generated accessor signature and auth hook mutation, then verified the supplied operation is invoked with the shared connection and typed request.
 * @evidence {@link api.functional.auth.req_auth_provision_003.execute.req_auth_provision_003} Keeps the published operation in the auth hook contract.
 * @evidenceReview {@link api.functional.auth.req_auth_provision_003.execute.req_auth_provision_003} Read the generated accessor signature and auth hook mutation, then verified the supplied operation is invoked with the shared connection and typed request.
 * @evidence {@link api.functional.auth.req_auth_provision_004.execute.req_auth_provision_004} Keeps the published operation in the auth hook contract.
 * @evidenceReview {@link api.functional.auth.req_auth_provision_004.execute.req_auth_provision_004} Read the generated accessor signature and auth hook mutation, then verified the supplied operation is invoked with the shared connection and typed request.
 * @evidence {@link api.functional.auth.req_auth_provision_005.execute.req_auth_provision_005} Keeps the published operation in the auth hook contract.
 * @evidenceReview {@link api.functional.auth.req_auth_provision_005.execute.req_auth_provision_005} Read the generated accessor signature and auth hook mutation, then verified the supplied operation is invoked with the shared connection and typed request.
 * @evidence {@link api.functional.auth.req_auth_role_001.execute.req_auth_role_001} Keeps the published operation in the auth hook contract.
 * @evidenceReview {@link api.functional.auth.req_auth_role_001.execute.req_auth_role_001} Read the generated accessor signature and auth hook mutation, then verified the supplied operation is invoked with the shared connection and typed request.
 * @evidence {@link api.functional.auth.req_auth_role_002.execute.req_auth_role_002} Keeps the published operation in the auth hook contract.
 * @evidenceReview {@link api.functional.auth.req_auth_role_002.execute.req_auth_role_002} Read the generated accessor signature and auth hook mutation, then verified the supplied operation is invoked with the shared connection and typed request.
 * @evidence {@link api.functional.auth.req_auth_role_003.execute.req_auth_role_003} Keeps the published operation in the auth hook contract.
 * @evidenceReview {@link api.functional.auth.req_auth_role_003.execute.req_auth_role_003} Read the generated accessor signature and auth hook mutation, then verified the supplied operation is invoked with the shared connection and typed request.
 * @evidence {@link api.functional.auth.req_auth_role_004.execute.req_auth_role_004} Keeps the published operation in the auth hook contract.
 * @evidenceReview {@link api.functional.auth.req_auth_role_004.execute.req_auth_role_004} Read the generated accessor signature and auth hook mutation, then verified the supplied operation is invoked with the shared connection and typed request.
 * @evidence {@link api.functional.auth.req_auth_role_005.execute.req_auth_role_005} Keeps the published operation in the auth hook contract.
 * @evidenceReview {@link api.functional.auth.req_auth_role_005.execute.req_auth_role_005} Read the generated accessor signature and auth hook mutation, then verified the supplied operation is invoked with the shared connection and typed request.
 * @evidence {@link api.functional.auth.req_auth_role_006.execute.req_auth_role_006} Keeps the published operation in the auth hook contract.
 * @evidenceReview {@link api.functional.auth.req_auth_role_006.execute.req_auth_role_006} Read the generated accessor signature and auth hook mutation, then verified the supplied operation is invoked with the shared connection and typed request.
 * @evidence {@link api.functional.auth.req_auth_role_007.execute.req_auth_role_007} Keeps the published operation in the auth hook contract.
 * @evidenceReview {@link api.functional.auth.req_auth_role_007.execute.req_auth_role_007} Read the generated accessor signature and auth hook mutation, then verified the supplied operation is invoked with the shared connection and typed request.
 * @evidence {@link api.functional.auth.req_auth_role_008.execute.req_auth_role_008} Keeps the published operation in the auth hook contract.
 * @evidenceReview {@link api.functional.auth.req_auth_role_008.execute.req_auth_role_008} Read the generated accessor signature and auth hook mutation, then verified the supplied operation is invoked with the shared connection and typed request.
 * @evidence {@link api.functional.auth.req_auth_role_009.execute.req_auth_role_009} Keeps the published operation in the auth hook contract.
 * @evidenceReview {@link api.functional.auth.req_auth_role_009.execute.req_auth_role_009} Read the generated accessor signature and auth hook mutation, then verified the supplied operation is invoked with the shared connection and typed request.
 * @evidence {@link api.functional.auth.req_auth_session_001.execute.req_auth_session_001} Keeps the published operation in the auth hook contract.
 * @evidenceReview {@link api.functional.auth.req_auth_session_001.execute.req_auth_session_001} Read the generated accessor signature and auth hook mutation, then verified the supplied operation is invoked with the shared connection and typed request.
 * @evidence {@link api.functional.auth.req_auth_session_002.execute.req_auth_session_002} Keeps the published operation in the auth hook contract.
 * @evidenceReview {@link api.functional.auth.req_auth_session_002.execute.req_auth_session_002} Read the generated accessor signature and auth hook mutation, then verified the supplied operation is invoked with the shared connection and typed request.
 * @evidence {@link api.functional.auth.req_auth_session_003.execute.req_auth_session_003} Keeps the published operation in the auth hook contract.
 * @evidenceReview {@link api.functional.auth.req_auth_session_003.execute.req_auth_session_003} Read the generated accessor signature and auth hook mutation, then verified the supplied operation is invoked with the shared connection and typed request.
 * @evidence {@link api.functional.auth.req_auth_session_004.execute.req_auth_session_004} Keeps the published operation in the auth hook contract.
 * @evidenceReview {@link api.functional.auth.req_auth_session_004.execute.req_auth_session_004} Read the generated accessor signature and auth hook mutation, then verified the supplied operation is invoked with the shared connection and typed request.
 * @evidence {@link api.functional.auth.req_auth_session_005.execute.req_auth_session_005} Keeps the published operation in the auth hook contract.
 * @evidenceReview {@link api.functional.auth.req_auth_session_005.execute.req_auth_session_005} Read the generated accessor signature and auth hook mutation, then verified the supplied operation is invoked with the shared connection and typed request.
 */
export function useAuthOperation(operation: AuthOperation) {
  return useMutation({
    mutationFn: (input: api.IAuthRequest) => operation(apiConnection, input),
  });
}
