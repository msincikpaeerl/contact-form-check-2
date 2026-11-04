# 0002 — Website stack: Astro, TypeScript, static output

- Status: accepted
- Date: 2026-11-04

## Context

The project is a small website: a home page and a contact form. It is a website, not a web app, so the default stack for websites applies.

## Decision

- Astro 7 with TypeScript (strict), `output: 'static'`: every page is prerendered at build time unless it opts out.
- ESLint (with typescript-eslint and eslint-plugin-astro) for lint, Prettier for formatting, `astro check` for type checking.
- Vitest for unit tests, Playwright for end-to-end tests (see [testing](../dev/testing.md)).
- Node.js 24 LTS. Versions are pinned exactly in `package.json`, and `package-lock.json` is committed.
- The documentation link check runs from pinned dev dependencies (`remark-cli`, `remark-validate-links`) through `npm run docs:links`.

This is the default stack for a website, so no other stack is considered an exception.

## Alternatives considered

- Another framework (Next.js, a plain Node server): not needed for a site this small; the default is lighter and already supports a server route.

## Consequences

Pages stay static and fast. The one server-side need is covered by [ADR 0003](0003-node-adapter-for-saving-messages.md).
