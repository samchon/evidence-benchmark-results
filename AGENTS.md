# AGENTS.md

This repository is the immutable publication surface for accepted `@samchon/lint-plugin-evidence` benchmark applications.

## Rules

- Store a result only at `<agent>/<model>/<project>/<evidence|plain>`.
- Never hand-correct an accepted leaf. Replace it only by publishing a different operator-accepted run in one commit; Git history preserves the predecessor.
- Require `benchmark.json`, `benchmark-report.json`, `package.json`, and `pnpm-lock.yaml` in every leaf.
- Retain `.benchmark-deps/*.tgz` for an evidence leaf whose lockfile uses the local archive.
- Never commit raw agent logs, controller state, caches, nested `.git`, `node_modules`, private environment files, credentials, or symbolic links.
- Keep repository artifacts and commit messages in English.
- Run `node scripts/discover-results.mjs` before committing. Run the affected leaf's build, lint, database, backend-test, and frontend-test gates when changing publication infrastructure.
