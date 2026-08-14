import type { tags } from "typia";

/** Scoped department or project manager assignment. */
export interface IManagerAssignment { /** Active employee responsible for the scope, or clear with null. */ managerId: null | (string & tags.Format<"uuid">); }
