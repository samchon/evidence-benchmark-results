import type { tags } from "typia";

export interface IAttachment { id: string & tags.Format<"uuid">; targetType: string; targetId: string; fileName: string; mimeType: string; storageKey: string; createdAt: string & tags.Format<"date-time">; }
export namespace IAttachment { export interface ICreate { targetType: string; targetId: string; fileName: string; mimeType: string; storageKey: string; } }
export interface IComment { id: string & tags.Format<"uuid">; targetType: string; targetId: string; body: string; createdAt: string & tags.Format<"date-time">; updatedAt: string & tags.Format<"date-time">; }
export namespace IComment { export interface ICreate { targetType: string; targetId: string; body: string; } export interface IUpdate { body: string; } }
export interface ITag { id: string & tags.Format<"uuid">; label: string; description: null | string; active: boolean; }
export namespace ITag { export interface ICreate { label: string; description?: null | string; } export interface IUpdate { label?: string; description?: null | string; } export interface IAssign { targetType: string; targetId: string; } }
