# QA Release Report

That’s My Lingo remains a static, Vercel-hosted, no-real-money entertainment game. This report defines the minimum checks before every production deployment.

## Required automated checks

```bash
node scripts/validate-static-site.mjs
node scripts/smoke-static-site.mjs
git diff --check
```

## Manual QA matrix

| Area | Required checks | Pass criteria |
| --- | --- | --- |
| Gameplay | Spin flow, insufficient Demo Coins, win/no-win outcomes, reset | No broken UI; all balances remain virtual |
| Rewards | Daily reward, mission claim, duplicate claim prevention | No cash value; rewards are XP, tokens, Demo Coins, or cosmetics |
| Telemetry | Spin, result, mission, daily, creator-code, monetization-click events | No names, emails, raw creator codes, secrets, or payment data |
| Accessibility | Keyboard navigation, focus states, aria-live status, reduced motion | Core game is operable without pointer-only controls |
| Responsive UI | Phone, tablet, desktop, narrow viewport | No clipped controls or unreadable wallet/status text |
| Compliance | Page copy, docs, reward tables, monetization copy | No cash-out, deposits, wagering, paid spins, crypto gambling, or redeemable prizes |
| Vercel deployment | `vercel.json`, security headers, static entrypoint | Headers parse and static site deploys without a build step |

## Release evidence template

- Release date:
- Commit SHA:
- Vercel deployment URL:
- Validation command output:
- Manual QA owner:
- Compliance reviewer:
- Known issues:
- Rollback target:

## Stop-ship rules

Do not release if any copy or flow suggests cash value, betting, paid spins, cash prizes, odds improvement, deposits, withdrawals, cryptocurrency gambling, or sports betting. Do not release persistent wallets until rewards are server-authoritative and audited.
