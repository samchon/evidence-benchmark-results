import { evidence } from "@ttsc/evidence";
import type { ITtscLintConfig } from "@ttsc/lint";

/**
 * File-only backend rules. The project-scoped Evidence graph stays in the
 * child configuration because its references span the complete test Program.
 */
export default {
  extends: "../lint.config.ts",
  files: ["../src/**/*.ts", "**/*.ts"],
  ignores: ["lint.config.ts", "scope.lint.config.ts"],
  plugins: {
    evidence,
  },
  rules: {
    "evidence/singular": "error",
  },
} satisfies ITtscLintConfig;
