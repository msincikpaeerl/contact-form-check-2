# Testing

| Level               | Tool                  | Where              | Runs with                                 |
| ------------------- | --------------------- | ------------------ | ----------------------------------------- |
| Unit                | Vitest                | `src/**/*.test.ts` | `npm test`, CI job `checks`               |
| End-to-end          | Playwright (Chromium) | `e2e/*.spec.ts`    | `npm run test:e2e`, CI job `e2e`          |
| Documentation links | remark-validate-links | all Markdown files | `npm run docs:links`, CI job `docs-links` |

## Unit tests

Logic that runs on the server lives in `src/lib/` with its test next to it. The sample test `src/lib/submission.test.ts` sends a form submission to `handleSubmission`, and checks that a valid one is written to a file (in a temporary folder) and an invalid one is rejected and writes nothing.

## End-to-end tests

`playwright.config.ts` builds the site, starts its Node server on port 4399 and opens it in Chromium. The sample test `e2e/smoke.spec.ts` checks that the site serves its page.

- Browsers come from the machine. If your Playwright version has none, run `npx playwright install chromium`. Never set `PLAYWRIGHT_BROWSERS_PATH` and never write a browser path in the project.
- In CI the `e2e` job installs the browser itself.

## Rules

New behaviour needs tests; a bug fix starts with a failing regression test; never weaken a test to make it pass.
