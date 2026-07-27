# Backend Contracts and Analytics Events

That’s My Lingo currently runs as a static Vercel-hosted entertainment game. Browser-local gameplay is demo-only. Before accounts, cloud saves, leaderboards, or persistent wallets launch, backend services must become authoritative for rewards, balances, mission claims, and audit logs.

## Vercel Web Analytics custom events

The static HTML build initializes the Vercel Analytics queue before loading `/_vercel/insights/script.js`, following Vercel’s HTML custom-event guidance: https://vercel.com/docs/analytics/custom-events.

Tracked event names:

- `tml_spin_start` — emitted before a valid virtual spin starts.
- `tml_spin_blocked` — emitted when a spin is blocked, such as insufficient Demo Coins.
- `tml_spin_result` — emitted after reel evaluation with win status and non-sensitive tier labels.
- `tml_daily_reward` — emitted after a daily virtual reward claim.
- `tml_daily_reward_blocked` — emitted when the daily reward has already been claimed.
- `tml_mission_claim` — emitted after a mission reward claim.
- `tml_mission_blocked` — emitted when a mission is incomplete or already claimed.
- `tml_creator_code_entered` — emitted with code length only, not the code value.
- `tml_sound_toggle` — emitted when opt-in sound changes.
- `tml_demo_reset` — emitted when local demo progress is reset.
- `tml_monetization_click` — emitted for merch, sponsor, founder, and creator campaign links.

Do not send names, emails, payment details, raw creator codes, secrets, or persistent cross-site identifiers in analytics payloads.

## Firestore collection contract

Recommended collections once Firebase is introduced:

- `profiles/{uid}`: `displayName`, `avatarId`, `accessibility`, `publicStatsOptIn`, `createdAt`, `updatedAt`.
- `wallets/{uid}`: `demoCoins`, `lingoTokens`, `loyaltyBucks`, `mysteryKeys`, `xp`, `level`, `updatedAt`.
- `inventories/{uid}/items/{itemId}`: `type`, `source`, `cosmeticOnly`, `earnedAt`.
- `missions/{uid}/claims/{claimId}`: `missionId`, `seasonId`, `status`, `rewardGrantId`, `createdAt`.
- `seasons/{seasonId}`: `name`, `startsAt`, `endsAt`, `rewardTableId`, `enabled`.
- `auditLogs/{eventId}`: `uid`, `source`, `action`, `before`, `after`, `clientVersion`, `createdAt`.

## Cloud Function command contract

All persistent economy actions should go through server functions:

- `claimDailyReward({ clientVersion })`
- `claimMission({ missionId, clientVersion })`
- `recordSpinReceipt({ spinId, bet, clientVersion })`
- `redeemCreatorAttribution({ codeHash, clientVersion })`
- `syncAccessibilityPrefs({ prefs, clientVersion })`

Server functions must validate auth, rate-limit the caller, read the active live-ops config, compute rewards server-side, write wallet/audit updates atomically, and return a display-safe reward summary.

## Compliance rules

- Never add cash-out, deposits, withdrawals, wagering, paid spins, sports betting, cryptocurrency gambling, or redeemable prizes.
- Keep cosmetics, merch, sponsors, founder support, ads, and digital packs separated from gameplay odds and wallet balances.
- Leaderboards and competitions can award only cosmetic/status rewards unless reviewed by counsel and platform policy.
