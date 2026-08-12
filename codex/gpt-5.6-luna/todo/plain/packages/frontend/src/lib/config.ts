const readBoolean = (value: string | undefined, fallback: boolean): boolean => {
  if (value === undefined) return fallback;
  if (value === "true") return true;
  if (value === "false") return false;
  throw new Error(`Expected a boolean environment value, received "${value}".`);
};

/**
 * Validated frontend environment settings.
 *
 * Simulation defaults off. No `.env` ships, so the default is the live mode
 * every checked-in workspace runs in. `pnpm --filter @benchmark/todo-frontend test:contract` turns simulation on
 * for its own suite through `vite build --mode contract`, which `vite.config.ts`
 * owns.
 */
export const config = {
  apiHost: import.meta.env.VITE_API_HOST ?? "http://127.0.0.1:37001",
  simulate: readBoolean(import.meta.env.VITE_API_SIMULATE, false),
} as const;
