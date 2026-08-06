# benchmark-erp

- Subject: erp
- Model: gpt-5.6-luna
- Arm: evidence

Built by an agent from the requirements under `docs/analysis/`.

## Commands

```bash
pnpm install
cp packages/backend/.env.example packages/backend/.env
pnpm build
pnpm schema:database
pnpm --filter @benchmark/erp-frontend playwright:install
pnpm test
```
