# Release Manifest

That’s My Lingo is currently a static Vercel deployment with browser-local demo progress. This manifest records the release shape and the checks required before production promotion.

## Current release shape

- **Hosting:** Vercel static site
- **Entrypoint:** `index.html`
- **Build step:** none
- **Runtime backend:** none
- **Persistence:** browser `localStorage` demo state only
- **Analytics:** Vercel Web Analytics pageviews and privacy-safe custom events
- **Performance:** Vercel Speed Insights script
- **Security:** `vercel.json` response headers and CSP
- **Economy authority:** demo/local only; future persistence must be server-authoritative

## Required release evidence

- Commit SHA
- Vercel deployment URL
- Output from `node scripts/validate-static-site.mjs`
- Output from `node scripts/smoke-static-site.mjs`
- Output from `git diff --check`
- Manual QA owner
- Compliance reviewer
- Rollback target

## Production gate checklist

1. Static validation passes.
2. Smoke test passes.
3. Diff whitespace check passes.
4. No copy or UI implies cash value, betting, deposits, paid spins, cash-out, odds improvement, cryptocurrency gambling, sports betting, or redeemable prizes.
5. Analytics payloads avoid names, emails, raw creator codes, payment data, secrets, and persistent cross-site identifiers.
6. Vercel security headers are present in `vercel.json`.
7. Rollback target is known before release.

## Rollback plan

If a production deploy fails validation after release, revert the merge commit or redeploy the last known-good Vercel deployment from the dashboard. Do not hotfix compliance language directly in production without review.
