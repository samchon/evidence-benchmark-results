import type { ITtscLintConfig } from "@ttsc/lint";

/** The frontend package runs the shared rules plus the frontend baseline. */
export default {
  extends: "../../config/lint.config.frontend.ts",
  rules: {
    // Generated Nestia accessors intentionally keep type/value imports together.
    "no-duplicate-imports": "off",
    "react/button-has-type": "off",
    "jsx-a11y/control-has-associated-label": "off",
    "typescript/no-floating-promises": "off",
    "typescript/no-misused-promises": "off",
    "tanstack-query/prefer-query-options": "off",
    "tanstack-query/exhaustive-deps": "off",
    "playwright/no-standalone-expect": "off",
  },
} satisfies ITtscLintConfig;
