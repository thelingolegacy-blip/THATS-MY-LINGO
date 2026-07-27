# Admin Operator Guide

This guide defines how future operators should manage That’s My Lingo events, promotions, and release gates without creating gambling or cash-value functionality.

## Operator workflow

1. **Draft**: Prepare season copy, reward table, art notes, feature flags, and event timing.
2. **Review**: Check compliance, economy impact, accessibility, and platform policy.
3. **Stage**: Enable the event only in preview or a non-production config.
4. **Publish**: Deploy through Vercel, monitor Web Analytics events, and keep rollback notes ready.
5. **Closeout**: Export metrics summary, archive event config, and document issues.

## Allowed reward types

- Demo Coins
- Lingo Tokens
- Loyalty Bucks
- Mystery Keys
- XP
- Badges
- Profile frames
- Cosmetic themes
- Status titles

## Disallowed reward types

- Cash
- Cash equivalents
- Gift cards tied to gameplay outcomes
- Withdrawable balances
- Crypto or tokenized gambling value
- Sports-betting entries
- Prize redemption based on spin outcomes
- Paid spins or improved odds

## Admin roles

- **Content operator**: drafts copy, art notes, missions, and schedule.
- **Economy reviewer**: checks reward amounts and no-cash-value language.
- **Compliance reviewer**: blocks wagering, payout, and prize-redemption language.
- **Release operator**: deploys through Vercel and confirms rollback path.
