# Virtual Game Mode Engine

This document defines a virtual-only game-mode roadmap for That’s My Lingo. It does not activate a live sweepstakes, cash prizes, paid spins, winner drawing, email notifications, admin authentication, or database-backed wallets.

## Core loop

1. Player opens the daily quest board.
2. Player completes a virtual challenge such as spins, XP gains, social-safe actions, or collection progress.
3. Player receives Demo Coins, Lingo Tokens, Loyalty Bucks, XP, Mystery Keys, badges, cosmetics, or status titles.
4. Player advances a season path.
5. Player unlocks cosmetic inventory and map zones.

All rewards are entertainment-only and have no cash value.

## Daily quests

Recommended quest categories:

- Spin 3 times.
- Earn 250 XP.
- Claim a daily reward.
- Unlock a badge.
- Visit a season map zone.
- Submit feedback.

Quest rewards must stay virtual and cannot increase odds in a live sweepstakes unless official rules and AMOE parity explicitly approve it.

## Virtual Legacy Wallet

The Legacy Wallet should be treated as a virtual progress display, not stored value. It can show:

- Demo Coins
- Lingo Tokens
- Loyalty Bucks
- Mystery Keys
- XP
- Badges
- Cosmetics
- Status titles

It must not represent cash, gift cards, withdrawable value, cryptocurrency, sweepstakes prize value, or redeemable balances.

## Seasons

Each season can define:

- `seasonId`
- `theme`
- `startsAt`
- `endsAt`
- `questSetId`
- `rewardTableId`
- `mapZones`
- `cosmeticUnlocks`
- `killSwitches`

Season rules must be independent from any legal sweepstakes rules unless reviewed and approved.
