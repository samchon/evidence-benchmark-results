# Evidence benchmark results

Applications produced by the `@samchon/lint-plugin-evidence` benchmark. Each
one was built by a coding agent from a frozen requirement corpus, under one of
two treatments: `evidence`, where a compiler-enforced provenance graph is
active, and `plain`, where nothing enforces traceability.

## Layout

```text
<agent>/<model>/<project>/<mode>/
```

```text
codex/gpt-5.6-luna/todo/plain/
codex/gpt-5.6-luna/todo/evidence/
```

`project` is one of `todo`, `reddit`, `shopping`, or `erp`. `mode` is `plain`
or `evidence`. The two modes of one project sit side by side because that pair
is what the benchmark compares.

Each leaf is the application's complete source. Agent streams, logs, caches,
build output and private environment files stay in the measurement repository.
A later run replaces a leaf in one commit, so history keeps its predecessors.
