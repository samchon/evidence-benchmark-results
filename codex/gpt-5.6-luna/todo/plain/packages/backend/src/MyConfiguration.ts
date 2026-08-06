import { ExceptionManager } from "@nestia/core";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import fs from "node:fs";
import path from "node:path";

import { MyGlobal } from "./MyGlobal";
import { PrismaErrorUtil } from "./utils/PrismaErrorUtil";

/** Reads runtime paths and validated environment-backed settings. */
export namespace MyConfiguration {
  /** Returns the configured HTTP port. */
  export const API_PORT = (): number => {
    const port: number = Number(MyGlobal.env.API_PORT);
    if (Number.isInteger(port) === false || port < 1 || port > 65_535)
      throw new Error(
        "Invalid environment API_PORT: expected an integer from 1 to 65535.",
      );
    return port;
  };

  /** Absolute workspace package root for source and compiled execution. */
  export const ROOT = (() => {
    const candidates = [
      __dirname,
      path.resolve(__dirname, ".."),
      path.resolve(__dirname, "../.."),
      path.resolve(__dirname, "../../.."),
    ];
    const root = candidates.find(
      (directory) =>
        fs.existsSync(path.join(directory, "package.json")) &&
        fs.existsSync(path.join(directory, "prisma")),
    );
    return (root ?? path.resolve(__dirname, "..")).replaceAll("\\", "/");
  })();
}

ExceptionManager.insert(PrismaClientKnownRequestError, PrismaErrorUtil.from);
