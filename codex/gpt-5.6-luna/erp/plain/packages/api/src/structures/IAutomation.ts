import type { tags } from "typia";

export interface IAutomationRun { id: string & tags.Format<"uuid">; organizationId: string & tags.Format<"uuid">; systemMembershipId: string & tags.Format<"uuid">; jobType: string; periodKey: string; status: "queued" | "running" | "completed" | "failed"; trigger: string; result: null | string; error: null | string; startedAt: string & tags.Format<"date-time">; completedAt: null | (string & tags.Format<"date-time">); attempts: number; }
