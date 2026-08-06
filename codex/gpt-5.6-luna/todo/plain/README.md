# benchmark-todo

- Subject: todo
- Model: gpt-5.6-luna
- Arm: plain

Built by an agent from the requirements under `docs/analysis/`.

## Commands

```bash
pnpm install
cp packages/backend/.env.example packages/backend/.env
pnpm build
pnpm schema:database
pnpm --filter @benchmark/todo-frontend playwright:install
pnpm test
```
