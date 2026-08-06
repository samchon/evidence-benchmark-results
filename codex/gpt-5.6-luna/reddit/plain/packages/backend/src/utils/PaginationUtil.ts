import type { IPage } from "@benchmark/reddit-api";
import { ErrorUtil } from "./ErrorUtil";

/** Builds paginated Prisma queries with stable response metadata. */
export namespace PaginationUtil {
  /** Inputs needed to execute and transform one paginated query. */
  export interface IProps<
    Where extends object,
    OrderBy extends object,
    Payload extends object,
    Raw extends object,
    Output extends object,
  > {
    /** Prisma-compatible read and count operations. */
    schema: {
      findMany(
        input: Payload & {
          skip?: number;
          take?: number;
          where?: Where;
          orderBy?: OrderBy | OrderBy[];
        },
      ): Promise<Raw[]>;
      count(input: { where: Where }): Promise<number>;
    };

    /** Constant query payload merged into every read. */
    payload: Payload;

    /** Maps one raw database record to its public DTO. */
    transform(record: Raw): Output | Promise<Output>;
  }

  /** Creates a paginated query executor from one schema adapter. */
  export const paginate =
    <
      Where extends object,
      OrderBy extends object,
      Payload extends object,
      Raw extends object,
      Output extends object,
    >(
      props: IProps<Where, OrderBy, Payload, Raw, Output>,
    ) =>
    (spec: { where: Where; orderBy: OrderBy[] }) =>
    async (input: IPage.IRequest): Promise<IPage<Output>> => {
      const limit = input.limit ?? 25;
      const current = input.page ?? 1;
      if (!Number.isInteger(limit) || limit < 1 || limit > 100)
        throw ErrorUtil.unprocessable("Limit must be between 1 and 100.");
      if (!Number.isInteger(current) || current < 1)
        throw ErrorUtil.unprocessable("Page must be a positive integer.");
      const scope = JSON.stringify({ where: spec.where, orderBy: spec.orderBy, payload: props.payload });
      let reset = false;
      if (input.continuation !== undefined && input.continuation !== null) {
        try {
          const token = JSON.parse(Buffer.from(input.continuation, "base64url").toString()) as { page: number; limit: number; scope: string };
          if (token.limit !== limit || token.scope !== scope || token.page < 2) throw new Error("stale continuation");
        } catch {
          reset = true;
        }
      }
      const effectivePage = reset ? 1 : current;
      const records = await props.schema.count({ where: spec.where });
      const data = await props.schema.findMany({
        ...props.payload,
        skip: (effectivePage - 1) * limit,
        take: limit,
        where: spec.where,
        orderBy: spec.orderBy,
      });
      const pages = Math.max(1, Math.ceil(records / limit));
      const next = effectivePage < pages ? Buffer.from(JSON.stringify({ page: effectivePage + 1, limit, scope })).toString("base64url") : null;
      return {
        data: await Promise.all(
          data.map(async (record) => props.transform(record)),
        ),
        pagination: {
          current: effectivePage,
          limit,
          records,
          pages,
          next,
          reset,
        },
      };
    };
}
