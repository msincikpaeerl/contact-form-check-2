# CLAUDE.md — contact-form-check-2

Instructions for Claude Code working on this repository. Keep this file under 150 lines.
Details belong in `docs/`; this file only points to them.

## What this project is

A simple website with a home page and a contact form. Messages sent through the form are saved to a file on the computer running the site. No e-mail, no database.

## Stack

Astro 7, TypeScript (strict), static output plus Astro's Node.js adapter (the site has its own server to check and save form submissions). Vitest for unit tests, Playwright for end-to-end tests, ESLint and Prettier. Node.js 24. Decisions: `docs/adr/0002-*` and `docs/adr/0003-*`.

## Read before working

1. The ticket you were given.
2. The documentation of the area you touch in `docs/dev/`.
3. The decisions in `docs/adr/` related to that area.

## Commands

| Task                                              | Command                |
| ------------------------------------------------- | ---------------------- |
| Install (from the lock file)                      | `npm ci`               |
| Run in development                                | `npm run dev`          |
| Lint                                              | `npm run lint`         |
| Format check (fix with `npm run format`)          | `npm run format:check` |
| Type check                                        | `npm run typecheck`    |
| Unit tests                                        | `npm test`             |
| Build                                             | `npm run build`        |
| Run the built site                                | `npm start`            |
| End-to-end tests (build and serve it themselves)  | `npm run test:e2e`     |
| Documentation link check (the same command as CI) | `npm run docs:links`   |

## Repository map

```
src/pages/    Astro pages and server routes (a route that must run on the server sets `prerender = false`)
src/lib/      Server-side logic and its unit tests (`*.test.ts` next to the code)
e2e/          Playwright end-to-end tests
data/         Saved messages, created at run time (ignored by Git)
docs/user/    User documentation, organised by tasks
docs/dev/     Developer documentation (architecture, setup, testing)
docs/adr/     Architecture Decision Records
.github/      CI and the pull request template
```

## Conventions

- Commits follow Conventional Commits with the ticket number: `feat(WEB-12): add contact form`.
- Every significant technical choice gets an ADR: copy `docs/adr/0000-template.md`, next number.
- A user-visible change updates `docs/user/` and `CHANGELOG.md` in the same pull request.
- CI: every job in `.github/workflows/ci.yml` is listed in the `needs` of the final `ci` job. Never rename or remove `ci`: branch protection requires it, and no pull request can be merged without it.
- Dependencies are pinned to exact versions; commit `package-lock.json`.
- Playwright: never set `PLAYWRIGHT_BROWSERS_PATH` and never write a browser path in the project.
- All text in English.

## Tests

- New behaviour needs tests.
- A bug fix starts with a regression test that fails before the fix.
- Never weaken or delete a test to make CI pass: fix the code, or explain in the pull request why the test was wrong.

## Before finishing

Every command in the Commands table must pass (except `npm run dev` and `npm start`, which run the site).

## Never

- Never commit secrets. Environment variables are listed in `.env.example` once the project has any.
- Never commit to the default branch: work on the ticket branch.
