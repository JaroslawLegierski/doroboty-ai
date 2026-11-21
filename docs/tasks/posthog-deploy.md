# PostHog deployment

## Intent and acceptance criteria

Deploy the existing PostHog PR to the existing Netlify site. Read the token and EU ingestion host from production build variables. Preserve the main worktree. Verify build and application flows, and confirm a real browser event reaches PostHog.

Autocapture must exclude private hash routes, forms, editable fields and dialogs. Recordings must mask all text and inputs and block private screens. Do not capture persona names, console output or raw URL searches. A static public CTA, "Zobacz oferty", is the smoke-test target.

## Hosting

Site: `3f6991a8-7301-471d-9181-f4f10369c0e2`.
Production build variables: `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN`, `VITE_PUBLIC_POSTHOG_HOST`.
No server, database, routing change or CSP relaxation is needed.
The site uses manual static deployment; build locally with the same variables.

## Verification

Node 24.22.3: formatting, design-system integrity (67 files and six renderer tests), lint, typecheck, 29 unit tests, baseline packet and production build passed. Default browser gate hit an occupied port 3106. All 34 browser scenarios subsequently passed on Edge at port 3118; Windows web-server teardown kept the runner process open after scenario completion.

The browser smoke test clicked "Zobacz oferty" and received HTTP 200 from EU event ingestion and replay ingestion, with no uncaught browser errors. Private persona/workspace screens had the blocking class. The test simulates a normal visitor by clearing the automation flag in its isolated browser context: unmodified headless automation is intentionally filtered by the SDK. Production bot filtering remains unchanged.

Netlify environment writes returned 403 (the CLI also failed to persist the values). Remote variables remain unset. This does not block this site's existing manual static deployment: `.env.local` provides the public configuration at local Vite build time and is gitignored. A future cloud build needs the two production build variables configured on Netlify.

Ten existing moderate npm audit findings remain. No merge, remote CI or production validation is implied by these local checks. Production evidence is recorded in the vault project deployment note after publishing.
