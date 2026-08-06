import type { tags } from "typia";

/** Account registration input. */
export interface IAuth {
  /** Canonicalized email identity. */
  email: string & tags.MinLength<1> & tags.MaxLength<320>;
  /** Password evaluated exactly as submitted. */
  password: string & tags.MinLength<8> & tags.MaxLength<128>;
  /** Initial private display name. */
  displayName: string & tags.MinLength<1> & tags.MaxLength<100>;
}
export namespace IAuth {
  /** Email/password login input. */
  export interface ILogin {
    email: string & tags.MinLength<1> & tags.MaxLength<320>;
    password: string & tags.MinLength<8> & tags.MaxLength<128>;
  }
  /** Refresh input carrying the previously issued refresh token. */
  export interface IRefresh { /** Previously issued refresh token. */
    refreshToken: string;
  }
  /** Issued authorization material and private actor identity. */
  export interface IAuthorized {
    /** Account identifier. */
    id: string & tags.Format<"uuid">;
    /** Bearer access token. */
    accessToken: string;
    /** Bearer refresh token. */
    refreshToken: string;
    /** Tokens retained by the SDK connection helper. */
    token: { access: string; refresh: string };
    /** Access-token lifetime in seconds. */
    expiresIn: number & tags.Type<"uint32">;
    /** Current private profile. */
    profile: { displayName: string };
  }
  /** Known-current-password plus replacement input. */
  export interface IChangePassword {
    currentPassword: string & tags.MinLength<8> & tags.MaxLength<128>;
    newPassword: string & tags.MinLength<8> & tags.MaxLength<128>;
  }
  /** Forgotten-password recovery proof and replacement. */
  export interface IRecoverPassword {
    email: string & tags.MinLength<1> & tags.MaxLength<320>;
    newPassword: string & tags.MinLength<8> & tags.MaxLength<128>;
    /** Proof token issued by the recovery-start operation. */
    proof: string;
  }
  /** Recovery-start input. */
  export interface IRecoverStart {
    email: string & tags.MinLength<1> & tags.MaxLength<320>;
  }
  /** Current-password confirmation for terminal account deletion. */
  export interface IDeleteAccount {
    /** Current password required for terminal deletion. */
    currentPassword: string & tags.MinLength<8> & tags.MaxLength<128>;
  }
}
