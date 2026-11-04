# Architecture

contact-form-check-2 is an Astro site with static pages and its own Node.js server (Astro's Node adapter, standalone mode). One process serves the pages and will receive the contact form.

- `src/pages/`: pages, prerendered at build time. A route that must run on the server sets `export const prerender = false`.
- `src/lib/submission.ts`: receives a submitted form (`handleSubmission`), checks it (`validateSubmission`) and appends it as a JSON line to a file under `data/` (`appendMessage`). No database.

- `src/pages/contact.astro`: the contact page (server-rendered). On POST it validates with `validateSubmission`, appends to `data/messages.jsonl` and redirects to `/contact?sent=1` (the confirmation), or re-renders the form with a 400 and one message per faulty field. A small script in the page repeats the check in the browser.

Decisions are in [`docs/adr/`](../adr/0001-record-architecture-decisions.md), in particular [the stack](../adr/0002-website-stack-astro-typescript.md) and [the Node adapter](../adr/0003-node-adapter-for-saving-messages.md).
