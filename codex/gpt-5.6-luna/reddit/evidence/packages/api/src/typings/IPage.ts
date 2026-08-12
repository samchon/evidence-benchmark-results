import type { tags } from "typia";

/**
 * One page of a larger result set.
 *
 * @template T Record shape carried by this page.
 */
export interface IPage<T extends object> {
  /**
   * Position and size of this page within the complete result set.
   */
  pagination: IPage.IPagination;

  /**
   * Records returned for the current page.
   */
  data: T[];

  /** Opaque continuation for the next page, or null on the final page. */
  next: null | string;

  /** True when an invalid continuation caused a fresh traversal reset. */
  reset: boolean;
}

export namespace IPage {
  /**
   * Pagination controls accepted by list operations.
   */
  export interface IRequest {
    /**
     * One-indexed page to read.
     *
     * @default 1
     */
    page?: null | (number & tags.Type<"uint32"> & tags.Minimum<1>);

    /**
     * Maximum number of records returned per page, from 1 through 100.
     *
     * @default 25
     */
    limit?: null | (number & tags.Type<"uint32"> & tags.Minimum<1> & tags.Maximum<100>);

    /** Opaque continuation from the preceding page. */
    cursor?: null | string;
  }

  /**
   * Position and size of one page within the complete result set.
   */
  export interface IPagination {
    /**
     * One-indexed page represented by this response.
     */
    current: number & tags.Type<"uint32"> & tags.Minimum<1>;

    /**
     * Maximum records requested for this page.
     */
    limit: number & tags.Type<"uint32">;

    /**
     * Total records matching the request.
     */
    records: number & tags.Type<"uint32">;

    /**
     * Total pages matching the request.
     */
    pages: number & tags.Type<"uint32">;
  }

  /**
   * Ordered list of ascending or descending columns.
   *
   * @template Column Column names accepted by one list operation.
   */
  export type Sort<Column extends string> = Array<
    `+${Column}` | `-${Column}`
  >;
}
