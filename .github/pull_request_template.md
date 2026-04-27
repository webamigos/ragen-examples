## Summary

<!-- What does this PR add or change? Link any related issue. -->

## Type of change

- [ ] New example
- [ ] Update to an existing example
- [ ] Docs / repo housekeeping

## Checklist

- [ ] `npx tsc --noEmit` passes in every affected example
- [ ] Each affected example has a working `.env.example` (no real secrets committed)
- [ ] Each affected example has a `README.md` covering prerequisites, setup, run, and "How it works"
- [ ] Smoke-tested locally with real Ragen credentials (`npm run dev` → endpoint responds)
- [ ] If a new example was added: row added to the table in the root `README.md` and to `matrix.example` in `.github/workflows/ci.yml`
- [ ] No `.env`, `node_modules/`, build output, or other generated files were committed
