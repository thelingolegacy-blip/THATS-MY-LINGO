# That’s My Lingo Live Ops and Release Readiness

This plan keeps That’s My Lingo in a virtual entertainment model. Demo Coins, Loyalty Bucks, Lingo Tokens, Mystery Keys, XP, badges, cosmetics, social rankings, and event rewards have no cash value and cannot be redeemed for money, prizes, cryptocurrency, or wagering benefits.

## Live operations model

- **Event scheduling:** daily rewards, weekly ladders, seasonal challenges, limited-time cosmetics, and community events.
- **Promotions:** merch drops, creator-code campaigns, sponsor placements, founder-support recognition, and cosmetic digital packs must remain outside the gameplay wallet.
- **Feature flags:** gate bonus rounds, free-spin modes, rewarded ads, push notifications, social sharing, leaderboards, and seasonal events.
- **Economy balancing:** tune only virtual rewards and progression speed. Persistent balance changes require server-side validation and audit logs.
- **Content management:** publish copy, theme packs, badges, avatars, and event metadata through reviewed admin tooling.

## Backend gate before persistence

The current Vercel deployment is a static browser game. Browser-local rewards are acceptable for demo play only. Before cloud saves or accounts launch, add:

1. Firebase Authentication for verified users.
2. Firestore rules that only allow user-owned reads/writes and block client-side economy mutation.
3. Cloud Functions for spin receipts, reward grants, mission claims, daily rewards, creator-code attribution, and anti-cheat checks.
4. Rate limits for reward, spin, mission, profile, and social endpoints.
5. Audit logs for wallet changes with before/after balances, request metadata, version, and source event.
6. Remote Config for event schedules, reward tables, app-version gates, and kill switches.

## Release checklist

- Run `node scripts/validate-static-site.mjs`.
- Run `node scripts/smoke-static-site.mjs`.
- Run `git diff --check`.
- Verify no copy promises cash value, cash-out, gambling, redeemable prizes, paid spins, improved odds, sports betting, or crypto wagering.
- Test keyboard focus on primary buttons, nav links, spin controls, mission claims, and mail links.
- Test reduced-motion behavior and confirm animations do not block reading or gameplay.
- Test mobile, tablet, desktop, and narrow browser layouts.
- Test corrupt or unavailable localStorage fallback by clearing site data and reloading.
- Verify Vercel security headers after deployment.

## Mobile readiness

Native iOS and Android releases should share the same economy and compliance rules. Add haptics, push notifications, crash reporting, app-store purchase handling for cosmetics only, and platform privacy disclosures after backend persistence is server-authoritative.
