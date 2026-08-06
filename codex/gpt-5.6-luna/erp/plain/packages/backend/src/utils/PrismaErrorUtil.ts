import { PrismaClientKnownRequestError, PrismaClientValidationError } from "@prisma/client/runtime/client";
import type { HttpException } from "@nestjs/common";

import { ErrorUtil } from "./ErrorUtil";

/** Translates known Prisma failures into public HTTP exceptions. */
export namespace PrismaErrorUtil {
  /** Maps Prisma's client-side query validation failures to a safe request error. */
  export function validation(error: PrismaClientValidationError): HttpException {
    return ErrorUtil.badRequest("The request contains an invalid business reference or value.", { cause: error });
  }

  /** Maps one known Prisma request error to its HTTP representation. */
  export function from(error: PrismaClientKnownRequestError): HttpException {
    switch (error.code) {
      case "P2025":
        return ErrorUtil.notFound("The requested resource was not found.", {
          cause: error,
        });
      case "P2002":
        return ErrorUtil.conflict(
          "The request conflicts with an existing resource.",
          { cause: error },
        );
      case "P2003":
      case "P2011":
      case "P2012":
      case "P2013":
      case "P2018":
      case "P2021":
      case "P2022":
      case "P2023":
      case "P2024":
      case "P2027":
        return ErrorUtil.badRequest("The request contains an invalid business reference or value.", { cause: error });
      default:
        return ErrorUtil.internal("The request could not be completed.", {
          cause: error,
        });
    }
  }
}
