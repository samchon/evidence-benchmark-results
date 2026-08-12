import type { tags } from "typia";
import type { IEntity, IPage } from "../typings";

/** A public uploaded image reference. */
export interface IMedia {
  /** Media identifier. */
  id: string & tags.Format<"uuid">;
  /** Accepted image MIME type. */
  mimeType: "image/jpeg" | "image/png" | "image/webp";
  /** Original image data as a data URL. */
  data: string;
  /** Bounded thumbnail data, when the image is a post payload. */
  thumbnail: null | string;
  /** Original width in pixels. */
  width: number & tags.Type<"uint32">;
  /** Original height in pixels. */
  height: number & tags.Type<"uint32">;
}

/** A public user profile and currently available authorship. */
export interface IProfile {
  /** Stable public username. */
  username: string;
  /** Editable public display name. */
  displayName: string;
  /** Editable public biography. */
  bio: string;
  /** Optional public avatar. */
  avatar: null | IMedia;
  /** Signed karma from current received votes. */
  karma: number;
  /** Available posts authored by this user. */
  posts: IPage<IPost.ISummary>;
  /** Available comments authored by this user. */
  comments: IPage<IComment.ISummary>;
}

/** Separate pagination controls for a public profile's authored content. */
export interface IProfileRequest {
  /** Post pagination. */
  posts?: IPage.IRequest;
  /** Comment pagination. */
  comments?: IPage.IRequest;
}

/** A public community. */
export interface ICommunity {
  /** Community identifier. */
  id: string & tags.Format<"uuid">;
  /** Public name in selected casing. */
  name: string;
  /** Public description. */
  description: string;
  /** Public icon. */
  icon: IMedia;
  /** Participation state. */
  status: "active" | "archived";
  /** Count of active subscriptions. */
  subscriberCount: number & tags.Type<"uint32">;
  /** Current owner, absent in an archive. */
  owner: null | IEntity;
}

/** A private subscription list item. */
export interface ISubscription {
  /** Subscription identifier. */
  id: string & tags.Format<"uuid">;
  /** Public community. */
  community: ICommunity;
  /** Activation instant. */
  activatedAt: string & tags.Format<"date-time">;
}

/** A post detail. */
export interface IPost {
  /** Post identifier. */
  id: string & tags.Format<"uuid">;
  /** Required title. */
  title: string;
  /** Immutable type. */
  type: "text" | "link" | "image";
  /** Text payload for text posts. */
  text: null | string;
  /** URL payload for link posts. */
  url: null | string;
  /** Image payload for image posts. */
  image: null | IMedia;
  /** Public author, absent only after account deletion. */
  author: null | IEntity & { username: string };
  /** Public community. */
  community: ICommunity;
  /** Current signed vote score. */
  score: number;
  /** Number of currently available comments. */
  commentCount: number & tags.Type<"uint32">;
  /** Immutable creation instant. */
  createdAt: string & tags.Format<"date-time">;
}

export namespace IPost {
  /** Compact feed and profile post presentation. */
  export interface ISummary {
    /** Post identifier. */
    id: string & tags.Format<"uuid">;
    /** Post title. */
    title: string;
    /** Post kind. */
    type: "text" | "link" | "image";
    /** Type-specific preview. */
    preview: string;
    /** Public author username, or deleted marker. */
    author: string;
    /** Public community name. */
    community: string;
    /** Current score. */
    score: number;
    /** Current available comment count. */
    commentCount: number & tags.Type<"uint32">;
    /** Immutable creation instant. */
    createdAt: string & tags.Format<"date-time">;
  }
  /** Creation request. */
  export interface ICreate {
    /** Community identifier. */
    communityId: string & tags.Format<"uuid">;
    /** Post title. */
    title: string & tags.MinLength<1> & tags.MaxLength<300>;
    /** Payload type. */
    type: "text" | "link" | "image";
    /** Text payload, only for text posts. */
    text?: null | (string & tags.MinLength<1> & tags.MaxLength<40000>);
    /** URL payload, only for link posts. */
    url?: null | (string & tags.MaxLength<2048>);
    /** Image payload, only for image posts. */
    image?: null | IMedia.ICreate;
  }
  /** Partial same-type post edit. */
  export interface IUpdate {
    /** Replacement title, or omit to retain it. */
    title?: null | (string & tags.MinLength<1> & tags.MaxLength<300>);
    /** Replacement text for a text post. */
    text?: null | (string & tags.MinLength<1> & tags.MaxLength<40000>);
    /** Replacement URL for a link post. */
    url?: null | (string & tags.MaxLength<2048>);
    /** Replacement image for an image post. */
    image?: null | IMedia.ICreate;
  }
  /** Feed sorting and traversal controls. */
  export interface IRequest extends IPage.IRequest {
    /** Feed order. */
    sort?: null | "hot" | "new" | "top" | "controversial";
    /** Required only for top sorting. */
    range?: null | "today" | "week" | "month" | "year" | "all";
  }
}

export namespace IMedia {
  /** Uploaded image input. */
  export interface ICreate {
    /** Image MIME type. */
    mimeType: "image/jpeg" | "image/png" | "image/webp";
    /** Encoded image data. */
    data: string;
    /** Decoded width. */
    width: number & tags.Type<"uint32">;
    /** Decoded height. */
    height: number & tags.Type<"uint32">;
  }
}

/** A recursively nested comment. */
export interface IComment {
  /** Comment identifier. */
  id: string & tags.Format<"uuid">;
  /** Author username, or a neutral deleted marker. */
  author: null | string;
  /** Text, or null for a deleted marker. */
  text: null | string;
  /** Current score. */
  score: number;
  /** Immutable creation instant. */
  createdAt: string & tags.Format<"date-time">;
  /** Nested replies. */
  replies: IComment[];
}
export namespace IComment {
  /** Compact profile comment. */
  export interface ISummary {
    /** Comment identifier. */
    id: string & tags.Format<"uuid">;
    /** Current text or neutral marker. */
    text: null | string;
    /** Parent post identifier. */
    postId: string & tags.Format<"uuid">;
    /** Current score. */
    score: number;
    /** Immutable creation instant. */
    createdAt: string & tags.Format<"date-time">;
  }
  /** New top-level comment input. */
  export interface ICreate {
    /** Post identifier. */
    postId: string & tags.Format<"uuid">;
    /** Optional immediate parent. */
    parentId?: null | (string & tags.Format<"uuid">);
    /** Nonblank comment text. */
    text: string & tags.MinLength<1> & tags.MaxLength<10000>;
  }
  /** Replacement comment text. */
  export interface IUpdate {
    /** Nonblank replacement. */
    text: string & tags.MinLength<1> & tags.MaxLength<10000>;
  }
  /** Thread sorting and root pagination. */
  export interface IRequest extends IPage.IRequest {
    /** Sibling order. */
    sort?: null | "best" | "new" | "controversial";
  }
}

/** A signed vote command. */
export interface IVote {
  /** Vote identifier. */
  id: string & tags.Format<"uuid">;
  /** Target post, or null for a comment target. */
  postId: null | (string & tags.Format<"uuid">);
  /** Target comment, or null for a post target. */
  commentId: null | (string & tags.Format<"uuid">);
  /** Current signed value. */
  value: 1 | -1;
}

/** A private moderation report. */
export interface IReport {
  /** Report identifier. */
  id: string & tags.Format<"uuid">;
  /** Target kind. */
  targetKind: "post" | "comment";
  /** Target identifier. */
  targetId: string & tags.Format<"uuid">;
  /** Reported content when still available. */
  target: null | string;
  /** Reporter username, or de-identified marker. */
  reporter: string;
  /** Nonblank report reason. */
  reason: string;
  /** Submission instant. */
  createdAt: string & tags.Format<"date-time">;
  /** unresolved or terminal outcome. */
  status: "unresolved" | "approved" | "dismissed";
}

/** A private active-ban item. */
export interface IBan {
  /** Ban identifier. */
  id: string & tags.Format<"uuid">;
  /** Banned user identifier used by scoped unban actions. */
  userId: string & tags.Format<"uuid">;
  /** Banned username. */
  username: string;
  /** Activation instant. */
  createdAt: string & tags.Format<"date-time">;
  /** Acting moderator username. */
  actor: string;
}

/** A private resolved moderation history item. */
export interface IModerationHistory {
  /** History identifier. */
  id: string & tags.Format<"uuid">;
  /** Event kind. */
  kind: "approved" | "dismissed" | "deleted" | "banned" | "unbanned";
  /** De-identified or current subject username. */
  subject: null | string;
  /** De-identified or current actor username. */
  actor: null | string;
  /** Optional report reason. */
  reason: null | string;
  /** Target description when still available. */
  target: null | string;
  /** Event instant. */
  createdAt: string & tags.Format<"date-time">;
}

/** Authentication lifecycle DTOs. */
export interface IAuth {
  /** Issued session material. */
  accessToken: string;
  /** Issued continuation material. */
  refreshToken: string;
  /** Public identity of the authenticated account. */
  user: IEntity & { username: string };
}
export namespace IAuth {
  /** Authenticated response shared by registration, login, refresh, and recovery journeys. */
  export interface IAuthorized extends IAuth {}
  /** Registration request. */
  export interface IJoin {
    /** Private sign-in email. */
    email: string & tags.Format<"email">;
    /** Public username. */
    username: string & tags.MinLength<3> & tags.MaxLength<30>;
    /** Plaintext password used only at the boundary. */
    password: string & tags.MinLength<8> & tags.MaxLength<128>;
  }
  /** Login request. */
  export interface ILogin {
    /** Sign-in email. */
    email: string & tags.Format<"email">;
    /** Plaintext password. */
    password: string & tags.MinLength<8> & tags.MaxLength<128>;
  }
  /** Refresh request. */
  export interface IRefresh {
    /** Refresh token issued by authentication. */
    refreshToken: string;
  }
  /** Change-password request. */
  export interface IPassword {
    /** Current password. */
    currentPassword: string & tags.MinLength<8> & tags.MaxLength<128>;
    /** Different replacement password. */
    newPassword: string & tags.MinLength<8> & tags.MaxLength<128>;
  }
  /** Recovery request. */
  export interface IRecoveryRequest {
    /** Registered email, with neutral response semantics. */
    email: string & tags.Format<"email">;
  }
  /** Recovery completion request. */
  export interface IRecoveryComplete {
    /** Proof supplied through the delivery boundary. */
    proof: string;
    /** Replacement password. */
    newPassword: string & tags.MinLength<8> & tags.MaxLength<128>;
  }
}

/** Profile edit request. */
export interface IProfileUpdate {
  /** Optional replacement display name. */
  displayName?: null | (string & tags.MinLength<1> & tags.MaxLength<255>);
  /** Optional replacement biography. */
  bio?: null | (string & tags.MaxLength<10000>);
  /** Optional replacement or explicit null avatar. */
  avatar?: null | IMedia.ICreate;
}

/** Password confirmation for permanent account deletion. */
export interface IAccountDelete {
  /** Current password. */
  password: string & tags.MinLength<8> & tags.MaxLength<128>;
}

/** Community creation request. */
export interface ICommunityCreate {
  /** Public community name. */
  name: string & tags.MinLength<3> & tags.MaxLength<50>;
  /** Public description. */
  description: string & tags.MinLength<1> & tags.MaxLength<1000>;
  /** Required icon. */
  icon: IMedia.ICreate;
}

/** Public community search request. */
export interface ICommunityRequest extends IPage.IRequest {
  /** Case-insensitive substring of the name. */
  search?: null | string;
}

/** Subscription list request. */
export type ISubscriptionRequest = IPage.IRequest;

/** Vote command request. */
export interface IVoteRequest {
  /** Post target, exclusive with commentId. */
  postId?: null | (string & tags.Format<"uuid">);
  /** Comment target, exclusive with postId. */
  commentId?: null | (string & tags.Format<"uuid">);
  /** Desired signed direction. */
  value: 1 | -1;
}

/** Report creation request. */
export interface IReportCreate {
  /** Post target, exclusive with commentId. */
  postId?: null | (string & tags.Format<"uuid">);
  /** Comment target, exclusive with postId. */
  commentId?: null | (string & tags.Format<"uuid">);
  /** Nonblank reason. */
  reason: string & tags.MinLength<1> & tags.MaxLength<2000>;
}

/** Scoped user identifier used by role and ban operations. */
export interface IUserTarget {
  /** Target platform user identifier. */
  userId: string & tags.Format<"uuid">;
}
