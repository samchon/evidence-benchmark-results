import type { tags } from "typia";
import type { IPage } from "../typings";

/** UUID used by every persisted public resource. */
export type UUID = string & tags.Format<"uuid">;

/** Generic success result returned by state-changing commands. */
export interface IResult {
  /** True when the requested command completed. */
  success: boolean;
}

/** Tokens and public identity issued by an authentication command. */
export interface IAuthorized {
  /** Short-lived bearer token for the current session. */
  token: string;
  /** One-time-use refresh token for session continuation. */
  refreshToken: string;
  /** Public identity associated with both tokens. */
  user: IUser.ISummary;
}

/** Public account profile; private credentials and email are never included. */
export interface IUser {
  /** Stable account identifier. */
  id: UUID;
  /** Globally unique public username, retaining selected casing. */
  username: string;
  /** Editable public display name. */
  displayName: string;
  /** Editable public biography; empty text means no biography. */
  bio: string;
  /** Optional image data URI; null means no avatar is assigned. */
  avatar: string | null;
  /** Signed total of active votes received by this account's available content. */
  karma: number;
  /** Immutable account creation instant in UTC. */
  createdAt: string & tags.Format<"date-time">;
}
export namespace IUser {
  /** Public identity projection used by authored and moderation relations. */
  export interface ISummary {
    /** Referenced account identifier. */
    id: UUID;
    /** Referenced public username. */
    username: string;
    /** Referenced public display name. */
    displayName: string;
  }
}

/** Public profile plus independently paginated authored content. */
export interface IProfile extends IUser {
  /** All currently available posts authored by this user, in a page. */
  posts: IPage<IPost.ISummary>;
  /** All currently available comments authored by this user, in a page. */
  comments: IPage<IComment.ISummary>;
}
export namespace IProfile {
  /** Caller-editable public profile fields; omitted fields retain their values. */
  export interface IUpdate {
    /** Replacement display name; whitespace-only values are refused. */
    displayName?: string;
    /** Replacement biography; null explicitly clears it. */
    bio?: string | null;
    /** Replacement avatar data URI; null explicitly removes it. */
    avatar?: string | null;
  }
  /** Independent page inputs for the profile's post and comment lists. */
  export interface IRequest {
    /** Traversal input for authored posts. */
    posts?: IPage.IRequest;
    /** Traversal input for authored comments. */
    comments?: IPage.IRequest;
  }
}

/** Public community descriptor and current subscription aggregate. */
export interface ICommunity {
  /** Stable community identifier. */
  id: UUID;
  /** Unique public name, retaining selected casing. */
  name: string;
  /** Public description text. */
  description: string;
  /** Optional community icon data URI. */
  icon: string | null;
  /** Participation lifecycle; archived communities are read-only. */
  status: "active" | "archived";
  /** Number of active user subscriptions. */
  subscriberCount: number;
  /** Current scoped owner, or null for an ownerless archive. */
  owner: IUser.ISummary | null;
}
export namespace ICommunity {
  /** Required fields for creating an active community. */
  export interface ICreate {
    /** Unique name of three through fifty allowed characters. */
    name: string & tags.MinLength<3> & tags.MaxLength<50> & tags.Pattern<"^[A-Za-z0-9_-]+$">;
    /** Visible description, at most one thousand characters. */
    description: string & tags.MinLength<1> & tags.MaxLength<1000>;
    /** Required JPEG, PNG, or WebP icon data URI. */
    icon: string;
  }
  /** Public community discovery and pagination input. */
  export interface IRequest extends IPage.IRequest {
    /** Case-insensitive substring filter on the normalized name. */
    search?: string | null;
  }
  /** Minimal community relation used by post and subscription cards. */
  export interface ISummary {
    /** Referenced community identifier. */
    id: UUID;
    /** Referenced public community name. */
    name: string;
  }
}

/** One active subscription and its activation instant. */
export interface ISubscription {
  /** Subscribed community, including its current public status and count. */
  community: ICommunity;
  /** Instant at which this subscription became active. */
  createdAt: string & tags.Format<"date-time">;
}

/** Complete available post representation. */
export interface IPost {
  /** Stable post identifier. */
  id: UUID;
  /** Required visible title. */
  title: string;
  /** Immutable payload kind. */
  type: "text" | "link" | "image";
  /** Full text for a text post; null for other kinds. */
  text: string | null;
  /** Full absolute URL for a link post; null otherwise. */
  url: string | null;
  /** Full uploaded image data URI for an image post; null otherwise. */
  image: string | null;
  /** Aspect-preserving thumbnail for an image post; null otherwise. */
  thumbnail: string | null;
  /** Public post author. */
  author: IUser.ISummary;
  /** Owning public community. */
  community: ICommunity.ISummary;
  /** Active upvotes minus active downvotes. */
  score: number;
  /** Count of currently available comments and replies. */
  commentCount: number;
  /** Immutable post creation instant in UTC. */
  createdAt: string & tags.Format<"date-time">;
  /** True only for internal/deleted projections; available reads omit deleted posts. */
  deleted?: boolean;
}
export namespace IPost {
  /** Feed-card projection with a type-specific preview. */
  export interface ISummary {
    /** Stable post identifier. */
    id: UUID;
    /** Post title. */
    title: string;
    /** Immutable payload kind. */
    type: "text" | "link" | "image";
    /** First 200 text characters, URL host, or image thumbnail. */
    preview: string | null;
    /** Image thumbnail, or null for text and link posts. */
    thumbnail: string | null;
    /** Public author projection. */
    author: IUser.ISummary;
    /** Public community projection. */
    community: ICommunity.ISummary;
    /** Active vote score. */
    score: number;
    /** Available comment count. */
    commentCount: number;
    /** Immutable creation instant. */
    createdAt: string & tags.Format<"date-time">;
  }
  /** Caller-supplied fields for creating one post. */
  export interface ICreate {
    /** Required trimmed title, one through three hundred characters. */
    title: string & tags.MinLength<1> & tags.MaxLength<300>;
    /** Payload kind selecting exactly one payload property. */
    type: "text" | "link" | "image";
    /** Text payload when type is text. */
    text?: string | null;
    /** Absolute HTTP(S) URL when type is link. */
    url?: string | null;
    /** JPEG, PNG, or WebP data URI when type is image. */
    image?: string | null;
  }
  /** Editable post fields; payload kind and ownership are immutable. */
  export interface IUpdate {
    /** Optional replacement title. */
    title?: string;
    /** Optional replacement text for a text post. */
    text?: string | null;
    /** Optional replacement URL for a link post. */
    url?: string | null;
    /** Optional replacement image for an image post. */
    image?: string | null;
  }
  /** Feed scope, sort, time range, and pagination input. */
  export interface IRequest extends IPage.IRequest {
    /** Feed order; hot is the default. */
    sort?: "hot" | "new" | "top" | "controversial";
    /** Rolling age window accepted only for Top. */
    range?: "today" | "week" | "month" | "year" | "all";
  }
}

/** Recursive public comment node; deleted nodes may be neutral markers. */
export interface IComment {
  /** Stable comment identifier. */
  id: UUID;
  /** Comment text, or null on a deleted marker. */
  text: string | null;
  /** Public author, or null when the node is deleted. */
  author: IUser.ISummary | null;
  /** Active vote score. */
  score: number;
  /** Immutable creation instant. */
  createdAt: string & tags.Format<"date-time">;
  /** Whether this node is a neutral deleted marker. */
  deleted: boolean;
  /** Recursively nested direct replies in the selected sibling order. */
  children: IComment[];
}
export namespace IComment {
  /** Non-recursive authored-comment projection used by profiles. */
  export interface ISummary {
    /** Stable comment identifier. */
    id: UUID;
    /** Available text, or null for a deleted marker (normally omitted in profiles). */
    text: string | null;
    /** Public author, or null for a deleted marker. */
    author: IUser.ISummary | null;
    /** Active vote score. */
    score: number;
    /** Immutable creation instant. */
    createdAt: string & tags.Format<"date-time">;
    /** Whether this projection is a deleted marker. */
    deleted: boolean;
  }
  /** New top-level comment or reply input. */
  export interface ICreate {
    /** Required nonblank comment text. */
    text: string;
    /** Available same-post parent; null or omission creates a top-level node. */
    parentId?: UUID | null;
  }
  /** Replacement text for an authored available comment. */
  export interface IUpdate {
    /** Required nonblank replacement text. */
    text: string;
  }
  /** Comment sibling sort and top-level pagination input. */
  export interface IRequest extends IPage.IRequest {
    /** Best, newest, or controversial sibling ordering. */
    sort?: "best" | "new" | "controversial";
  }
}

/** Result of one accepted vote transition. */
export interface IVote {
  /** Current value held by the caller after the transition. */
  value: "up" | "down" | null;
  /** Target score after the transition. */
  score: number;
}

/** Requested upvote, downvote, or removal transition. */
export interface IVoteRequest {
  /** Desired signed vote state. */
  value: "up" | "down" | "remove";
}

/** User selected for a community-scoped moderator assignment. */
export interface IModerationTarget {
  /** Active target account identifier. */
  userId: UUID;
}

/** Pending or resolved private content report. */
export interface IReport {
  /** Stable report identifier. */
  id: UUID;
  /** Identifier of the reported post or comment. */
  targetId: UUID;
  /** Kind of reported target. */
  targetType: "post" | "comment";
  /** Target payload while it remains available; null after removal. */
  target: IPost | IComment | null;
  /** Public reporter projection, de-identified after account deletion. */
  reporter: IUser.ISummary;
  /** Trimmed report reason, private to responsible moderators. */
  reason: string;
  /** Submission instant. */
  createdAt: string & tags.Format<"date-time">;
  /** Pending queue or terminal moderation outcome. */
  status: "pending" | "approved" | "dismissed";
}
export namespace IReport {
  /** Caller input for one post or comment report. */
  export interface ICreate {
    /** Available target identifier. */
    targetId: UUID;
    /** Target kind selecting post or comment. */
    targetType: "post" | "comment";
    /** Nonblank reason of at most two thousand characters. */
    reason: string;
  }
}

/** Private resolved report history; removed targets are null. */
export interface IReportHistory extends Omit<IReport, "target" | "status"> {
  /** Available target description, or null after deletion. */
  target: IPost | IComment | null;
  /** Acting moderator, de-identified after account deletion. */
  moderator: IUser.ISummary | null;
  /** Terminal outcome retained for private history. */
  status: "approved" | "dismissed";
  /** Resolution instant. */
  resolvedAt: string & tags.Format<"date-time">;
}

/** Active community ban record. */
export interface IBan {
  /** Stable ban identifier. */
  id: UUID;
  /** Banned account projection. */
  user: IUser.ISummary;
  /** Acting moderator projection. */
  moderator: IUser.ISummary;
  /** Activation instant. */
  createdAt: string & tags.Format<"date-time">;
}

/** Historical ban record including optional ending information. */
export interface IBanHistory extends IBan {
  /** Moderator who ended the ban, or null while it remains active. */
  unbannedBy: IUser.ISummary | null;
  /** Ending instant, or null while active. */
  endedAt: (string & tags.Format<"date-time">) | null;
}

/** Authentication and account-management input DTOs. */
export namespace IAuth {
  /** Registration credentials. */
  export interface IJoin {
    /** Private sign-in email. */
    email: string & tags.Format<"email">;
    /** Public username of three through thirty allowed characters. */
    username: string & tags.MinLength<3> & tags.MaxLength<30> & tags.Pattern<"^[A-Za-z0-9_]+$">;
    /** Password of eight through one hundred twenty-eight characters. */
    password: string & tags.MinLength<8> & tags.MaxLength<128>;
  }
  /** Existing email and password credentials. */
  export interface ILogin {
    /** Case-insensitive private sign-in email. */
    email: string & tags.Format<"email">;
    /** Candidate password; never returned. */
    password: string;
  }
  /** Optional refresh-token body; the bearer header is the fallback. */
  export interface IRefresh {
    /** Presented refresh token. */
    refreshToken?: string;
  }
  /** Current and replacement password credentials. */
  export interface IChangePassword {
    /** Current password proof. */
    currentPassword: string;
    /** Replacement password. */
    newPassword: string & tags.MinLength<8> & tags.MaxLength<128>;
  }
  /** Neutral password-recovery request. */
  export interface IRecoveryRequest {
    /** Registered email to which an out-of-band proof is issued. */
    email: string & tags.Format<"email">;
  }
  /** One-time recovery proof and replacement password. */
  export interface IRecoveryComplete {
    /** Registered email for the proof. */
    email: string & tags.Format<"email">;
    /** One-time proof from the recovery journey. */
    proof: string;
    /** Replacement password. */
    newPassword: string & tags.MinLength<8> & tags.MaxLength<128>;
  }
  /** Current password confirmation for permanent deletion. */
  export interface IDeleteAccount {
    /** Current password proof; never returned. */
    password: string;
  }
}
