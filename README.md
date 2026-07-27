# THATS-MY-LINGO

Static no-real-money virtual casino game for That’s My Lingo.

Included in the full game surface:

- five-reel virtual slot gameplay with weighted symbols
- row paylines, wild symbols, scatter bonuses, and multiplier outcomes
- virtual coin bank, bet controls, XP, levels, tokens, daily rewards, missions, and creator-code rewards
- weekly ladder, cosmetic pass, achievement badges, unlockable profile status, optional social surfaces, and live-ops readiness
- browser-local saved progress with corrupt-storage fallback
- CSS-built visual assets, reel animations, coin-burst effects, and reduced-motion handling
- opt-in Web Audio sound effects generated in the browser
- Vercel Analytics and Speed Insights scripts with custom event hooks for gameplay, rewards, creator-code attribution, and monetization clicks
- non-wagering monetization lanes for merch, sponsor packages, founder support, creator-code campaigns, cosmetic digital packs, and sponsored community events
- no deposits, withdrawals, cash-out, paid spins, cash prizes, payments tied to gameplay outcomes, gambling services, backend, database, or package install

## Live operations and release readiness

See `docs/live-ops-release-readiness.md` for the event, admin tooling, backend persistence, QA, mobile-readiness, and release checklist. See `docs/backend-contracts.md` and `docs/live-ops-schema.example.json` for analytics events, Firestore collections, Cloud Function command contracts, and live-ops schema examples. See `docs/qa-release-report.md`, `docs/admin-operator-guide.md`, `docs/release-manifest.md`, and `docs/qa-metadata.json` for release evidence, manual QA, stop-ship rules, operator roles, admin workflow, launch gates, and machine-readable QA metadata. See `docs/app-store-readiness.md`, `docs/privacy-disclosures.md`, and `docs/privacy-metadata.json` for mobile policy, privacy disclosures, and app-store readiness. See `docs/sweepstakes-readiness.md`, `docs/sweepstakes-backend-architecture.md`, and `docs/sweepstakes-metadata.json` for planning-only sweepstakes compliance gates, AMOE parity, backend architecture, and launch blockers.

## Validate

```bash
node scripts/validate-static-site.mjs
node scripts/smoke-static-site.mjs
git diff --check
```

## Safety

All coins, tokens, XP, badges, Loyalty Bucks, Mystery Keys, streaks, and rewards are virtual entertainment-only values with no cash value. Monetization must stay outside the game wallet and cannot sell spins, improve odds, enable cash-out, or create redeemable prizes.
