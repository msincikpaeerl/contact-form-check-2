# Setup

## Requirements

Node.js 24 (LTS) with npm.

## Install and run

```
npm ci            # install the exact versions of package-lock.json
npm run dev       # development server with reload
npm run build     # build the site and its Node server into dist/
npm start         # run the built site
```

`npm start` listens on `localhost:4321` by default. Set `HOST` and `PORT` to change it.

## Checks

| Command                | What it does                                                   |
| ---------------------- | -------------------------------------------------------------- |
| `npm run lint`         | ESLint                                                         |
| `npm run format:check` | Prettier check (`npm run format` rewrites the files)           |
| `npm run typecheck`    | `astro check`                                                  |
| `npm test`             | Vitest unit tests                                              |
| `npm run test:e2e`     | Playwright (builds and serves the site itself)                 |
| `npm run docs:links`   | Checks that every relative link in the Markdown files is valid |

## Saved messages

The site writes messages to the `data/` folder, created on first use and ignored by Git. See [ADR 0003](../adr/0003-node-adapter-for-saving-messages.md).

## Environment variables

None yet.

## Continuous integration

Every pull request runs the jobs of [`.github/workflows/ci.yml`](../../.github/workflows/ci.yml): `checks` (lint, format, types, unit tests, build), `e2e` (Playwright, installs its own browser) and `docs-links`. The final `ci` job requires all of them.
