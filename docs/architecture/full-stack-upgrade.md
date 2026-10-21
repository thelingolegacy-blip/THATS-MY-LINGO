# That’s My Lingo — Full-Stack Upgrade Plan

**Status:** proposal and non-deploying quality gates only. This document does not certify or activate production.
**Protected baseline:** preserve `main`, production routes, existing GDevelop gameplay, and all existing media. Work in isolated branches and promote only through reviewed pull requests.
**Product boundary:** entertainment-only virtual Play Coins. No deposits, cash-out, wagering for money, or conversion of virtual balances into sweepstakes entries.

## Current repository evidence
The GitHub project `thelingolegacy-blip/THATS-MY-LINGO` currently has a static `index.html`, `public/`, `assets/`, `casino-pack/`, `dashboard/`, `scripts/`, and a legacy Webpack workflow. The GitLab fork `zavionecook/FameMoneyFortune` has a separate .NET/template-oriented tree and a G02 runner evidence sentinel. Do not assume these repositories are a synchronized monorepo or that Flutter/Firebase source exists in either tree.

## Target architecture and responsibilities

### Frontend / web
- Keep the existing game as the source of truth for current GDevelop gameplay; do not rewrite core mechanics as part of a visual-only pass.
- Establish a shared Industrial Noir design system: black/obsidian surfaces, crimson lighting, gold metallic accents, responsive typography, keyboard focus, reduced-motion support, and explicit empty/loading/error/offline states.
- Use a media manifest with stable IDs, dimensions, format, license/ownership, alt text, and version/checksum. Deliver AVIF/WebP derivatives and lazy-load noncritical backgrounds; never bake essential UI copy into artwork.
- Split lobby/game/table/dashboard/promotions into independently testable views while keeping virtual wallet values clearly labelled as fictional.
- Track client events for UX analytics only; client events are not authoritative game results or balances.

### Game rules and backend
- Treat the browser as untrusted. A trusted Cloud Function or authenticated Worker endpoint must validate a game action, obtain server-side randomness, evaluate the rules, and return a signed/traceable result.
- Use an idempotency key for every mutating request. Validate user identity, schema, bet range, available virtual balance, rate limits, game version, and replay protection before settlement.
- Model the wallet as an append-only ledger: unique transaction ID, UID, game/session ID, request idempotency key, debit, credit, reason, server timestamp, and resulting balance. Apply debit and settlement atomically; never trust a balance sent by the client.
- Separate XP/progression from wallet accounting. Add property tests for no negative balance, no duplicate settlement, no client-selected outcome, and deterministic rule evaluation for supplied outcomes.
- Card/slot mathematics must have a versioned paytable/ruleset, documented return-to-player for entertainment metrics if useful, exact rounding rules, edge-case tests, and a reproducible simulation report. Do not describe client-side demos as certified.

### Firebase
- Use separate development and production Firebase projects. Never point preview builds at production data.
- Firebase Authentication provides identity; Firestore stores profiles and non-authoritative read models; callable/HTTPS Cloud Functions enforce wallet, XP, rewards, leaderboards, and game settlements.
- Default-deny Firestore and Storage rules. Clients may read only authorized profile/read-model fields; clients cannot write wallet balances, transaction ledger, RNG outcomes, reward grants, winner records, or administrative flags.
- Validate App Check, auth claims, input schema, rate limits, audit events, and secrets. Store provider credentials in secret managers; never commit service-account keys or .env secrets.
- Add emulator tests for Auth/Firestore/Functions rules and integration tests for concurrent requests and idempotent retries before enabling persistence.

### Flutter mobile
- Keep Flutter as a consumer of the same backend contracts; do not duplicate wallet or outcome logic in Dart.
- Add environment-specific Firebase options, Auth state handling, repository interfaces, typed API DTOs, retry/idempotency handling, offline read-only behavior, and Crashlytics/Analytics with privacy review.
- Add widget tests for navigation and responsive layouts, integration tests against Firebase emulators, Android/iOS build checks, accessibility checks, and signed release artifacts only after gates pass.
- Keep secrets out of Flutter assets; all client configuration is public by design and must be protected by server-side authorization.

### Cloudflare
- Use Pages for static preview hosting and Workers for edge APIs only after reviewing the existing DNS/Worker authority. Do not change production DNS, routes, redirects, caching, or secrets during this phase.
- Use a separate preview project/hostname and preview-only bindings. Keep game settlement in a trusted backend with durable storage/atomicity; do not use edge cache/KV as a wallet ledger.
- If Worker APIs are adopted, enforce origin policy, authentication, request validation, rate limiting, safe CORS, request IDs, and structured logs. Cache only immutable public media and public read-only assets.
- Record build ID, commit SHA, asset manifest checksum, and environment on every preview artifact.

### GitHub / GitLab / CI/CD
- GitHub is the primary source repository for this upgrade; GitLab remains a separate mirror/fork until an explicit synchronization contract is agreed.
- Keep branches isolated; pull requests/merge requests are the only promotion path. Never push directly to `main` or activate production from this workflow.
- Run HTML/inline-JS static checks, media-reference validation, Flutter analyze/tests when a Flutter project is actually present, Firebase emulator/rules tests when Firebase config is present, and secret/dependency scans.
- CI should use least-privilege permissions, pinned action versions where feasible, concurrency cancellation, artifacts with commit provenance, and no production credentials on pull-request builds.
- Existing G02 runner dispatch/evidence status is a separate release gate. A green static check does not imply G02 passed, nor authorize production.

## Promotion gates (fail closed)
1. **Source:** confirm exact repository, base commit, branch, and diff.
2. **Quality:** syntax, lint, game-math tests, accessibility, responsive screenshots, media manifest, dependency/secret scans.
3. **Backend:** emulator rules tests, atomic/idempotent ledger tests, concurrent request tests, auditability, abuse/rate-limit checks.
4. **Mobile:** Flutter analyze, unit/widget/integration tests, Android/iOS build checks and Crashlytics validation.
5. **Preview:** deploy only to isolated preview; verify public asset paths, CSP/security headers, CORS, routing, and mobile behavior.
6. **Evidence:** save CI logs, test reports, build SHA, screenshots, asset manifest, and independent verification.
7. **Acceptance:** reviewer sign-off, rollback plan, production authorization. If any required evidence is missing, stop.

## Sweepstakes boundary
Keep promotions separate from game currency. A production sweepstakes requires reviewed official rules, eligibility and jurisdiction controls, start/end times, prize and odds disclosures as applicable, privacy/consent controls, a lawful entry method, fraud prevention, auditable winner selection, and legal review. The current signup is only a UI prototype; it must not imply an active entry or prize.

## Immediate implementation sequence
1. Land non-deploying HTML/inline-JS quality gate in this isolated PR.
2. Repair CI runner dispatch/evidence independently; do not hide or bypass G02.
3. Inventory the real GDevelop project and media references, then add manifest-based asset validation.
4. Add Firebase emulator rules and game-service contract tests in the actual backend repository.
5. Add Flutter integration in the actual Flutter repository after confirming its path and current SDK versions.
6. Configure Cloudflare preview only after identifying the authorized Pages project, Worker routes, bindings, and DNS authority.
7. Align GitLab pipeline on a separate MR and verify it independently; do not infer that GitHub CI validates GitLab.
