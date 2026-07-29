# Evidence benchmark results

This repository retains operator-accepted applications produced by the `@samchon/lint-plugin-evidence` benchmark. It keeps every coding agent, model, subject, and comparison mode in one searchable history instead of creating a GitHub repository per cell.

## Layout

```text
<agent>/<model>/<project>/<mode>/
```

For example:

```text
codex/gpt-5.6-terra/todo/evidence/
codex/gpt-5.6-terra/todo/plain/
claude-code/sonnet-5/todo/evidence/
claude-code/sonnet-5/todo/plain/
```

`project` is one of `todo`, `reddit`, `shopping`, or `erp`. `mode` is `evidence` or `plain`. Filesystem model names are stable lowercase slugs; `benchmark.json` retains the exact provider model identity.

The current campaign uses Codex `gpt-5.6-terra` at `high` effort and Claude Code `sonnet-5` at `high` effort.

## Result contract

Each leaf is a self-contained generated application and includes:

- `benchmark.json` with the agent, model, project, mode, run identity, source revision, frozen-input hashes, and acceptance status;
- `benchmark-report.json` with elapsed time, native token categories, API-equivalent cost, coverage, quality, and intervention findings;
- the complete application source, lockfile, and tests; and
- `.benchmark-deps/*.tgz` when the frozen lockfile installs the locally packed evidence plugin.

Raw agent streams, controller logs, caches, and private environment files remain in the measurement repository. Each leaf contains the latest accepted run for that exact agent, model, project, and mode. A later accepted run replaces the leaf in one new commit, so Git history preserves every predecessor without multiplying repositories.

## Verification

The root workflow discovers every accepted leaf, validates its path and metadata, performs a frozen pnpm install, then runs build, lint, database preparation, backend tests, and Chromium frontend tests. Nested project workflows are not used because GitHub Actions only loads workflows from the repository root.

Validate the repository inventory locally:

```bash
node scripts/discover-results.mjs
```
