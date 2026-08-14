import type { tags } from "typia";

/** Organization ledger account. */
export interface IAccount { id: string & tags.Format<"uuid">; code: string; name: string; type: "asset" | "liability" | "equity" | "revenue" | "expense"; parentId: null | (string & tags.Format<"uuid">); currency: string; active: boolean; mergedIntoId: null | (string & tags.Format<"uuid">); }
export namespace IAccount { export interface ICreate { code: string; name: string; type: IAccount["type"]; parentId?: null | (string & tags.Format<"uuid">); currency: string; } export interface IUpdate { name?: string; parentId?: null | (string & tags.Format<"uuid">); active?: boolean; } export interface IMerge { targetAccountId: string & tags.Format<"uuid">; reason: string; } }
