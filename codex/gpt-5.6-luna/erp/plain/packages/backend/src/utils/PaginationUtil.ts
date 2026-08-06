import { ErrorUtil } from "./ErrorUtil";

export namespace PaginationUtil {
  export function page(input: { page?: number | null; limit?: number | null }) {
    const limit = input.limit ?? 100;
    const current = input.page ?? 1;
    if (!Number.isInteger(current) || current < 1)
      throw ErrorUtil.badRequest("pagination.page must be a positive integer.");
    if (!Number.isInteger(limit) || limit < 0)
      throw ErrorUtil.badRequest("pagination.limit must be a non-negative integer.");
    return { limit, current, skip: (current - 1) * limit, take: limit === 0 ? undefined : limit };
  }
}
