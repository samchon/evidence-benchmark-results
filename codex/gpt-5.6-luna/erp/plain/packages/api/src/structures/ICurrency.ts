import type { tags } from "typia"; import type { IPage } from "../typings";
export interface ICurrency { id: string & tags.Format<"uuid">; code: string; name: string; precision: number; active: boolean; createdAt: string & tags.Format<"date-time">; updatedAt: string & tags.Format<"date-time">; }
export namespace ICurrency { export interface ICreate { code: string; name: string; precision: number; } export interface IUpdate { name?: string; precision?: number; } export interface IRequest extends IPage.IRequest { search?: string | null; active?: boolean | null; } }
