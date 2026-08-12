import type { IPage } from "../typings";
import type { tags } from "typia";

/** Shared two-level merchandise category. */
export interface IShoppingCategory {
  /** Category UUID. */
  id: string & tags.Format<"uuid">;
  /** Category name. */
  name: string;
  /** Category description. */
  description: string;
  /** Direct parent, or null for top-level categories. */
  parentId: string | null;
  /** Direct children. */
  children: IShoppingCategory[];
  /** Creation instant. */
  createdAt: string & tags.Format<"date-time">;
}
export namespace IShoppingCategory {
  /** Category list item. */
  export type ISummary = IShoppingCategory;
  /** Category creation input. */
  export interface ICreate { name: string & tags.MinLength<1>; description: string; parentId?: string | null; }
  /** Category update input. */
  export type IUpdate = ICreate;
  /** Category list input. */
  export type IRequest = IPage.IRequest;
}
