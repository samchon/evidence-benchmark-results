# Evidence benchmark results

![Evidence Graph](https://ttsc.dev/og-evidence.png)

Applications produced by the `@ttsc/evidence` benchmark.

Each one was built by a coding agent from a frozen requirement corpus, under one of two treatments: `evidence`, where a compiler-enforced provenance graph is active, and `plain`, where nothing enforces traceability.

## Layout

```text
<agent>/<model>/<project>/<mode>/
```

```text
codex/gpt-5.6-luna/todo/plain/
codex/gpt-5.6-luna/todo/evidence/
```

- **project**: `todo`, `reddit`, `shopping`, `erp`
- **mode**: `plain`, `evidence`

The two modes of one project sit side by side because that pair is what the benchmark compares.

Each leaf is the application's complete source.

`codex/gpt-5.6-luna/erp/plain` is absent: its cell is still running, and it is added when it completes.

## What a leaf omits

Three things a workspace carries are the measurement rig rather than the application, and are left out:

- `.npmrc`, which pins pnpm's virtual store to an absolute path on the measuring machine.
- `.benchmark-deps`, the packed toolchain the workspace installs from. `package.json` and `pnpm-workspace.yaml` still point at it, so a leaf is read rather than installed as it stands.
- `.playwright-mcp`, the browser tool's own console and page scratch.

Measured token spend, work time, cost, and coverage for the same cohort are published at [ttsc.dev](https://ttsc.dev/docs/benchmark/evidence).
