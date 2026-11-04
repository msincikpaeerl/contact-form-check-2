# 0003 — Astro's Node.js adapter, messages saved to a file

- Status: accepted
- Date: 2026-11-04

## Context

Visitors send messages through a contact form. The site must check each submission and save it to a file on the computer running the site. There is no database. A purely static site cannot do this: it needs a server.

## Decision

- Use `@astrojs/node` in `standalone` mode. The build produces a Node server (`dist/server/entry.mjs`, started with `npm start`) that also serves the static pages.
- The output stays `static`: pages are prerendered, and only routes that must run on the server (the one receiving the form) set `export const prerender = false`.
- Saved messages are appended as one JSON object per line to a file under `data/` (ignored by Git). The logic lives in `src/lib/submission.ts`: `validateSubmission` checks the fields, `appendMessage` writes the line, and `handleSubmission` ties them together for a request. A unit test shows the whole path; the ticket SWWCF-3 wires it to the form.

## Alternatives considered

- A database: ruled out by the requirements.
- Fully static site with an external form service: messages would not be saved on the computer running the site.
- Astro `output: 'server'`: renders every page on request, which the static pages do not need.

## Consequences

The site must be run with Node.js (`npm run build`, then `npm start`) rather than copied to a static host. The `data/` folder must be writable and backed up by whoever runs the site. Concurrent appends of single short lines are acceptable at this scale.
