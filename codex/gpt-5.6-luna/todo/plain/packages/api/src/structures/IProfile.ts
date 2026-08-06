import type { tags } from "typia";

/** Private profile read shape. */
export interface IProfile {
  /** Current trimmed display name. */
  displayName: string & tags.MinLength<1> & tags.MaxLength<100>;
}
export namespace IProfile {
  /** Display-name replacement input. */
  export interface IUpdate {
    /** Proposed display name, trimmed by the server. */
    displayName: string & tags.MinLength<1> & tags.MaxLength<100>;
  }
}
