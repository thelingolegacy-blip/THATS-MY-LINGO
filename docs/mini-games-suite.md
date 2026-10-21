# LINGO Mini Games — Preview Specification

## Included prototypes
1. **Spades Is My Lingo** — four-seat trick-taking prototype. Spades are trump; follow suit when possible; a trick-count prototype; formal bidding and team-contract scoring are not implemented yet. This is not full tournament-grade Spades yet.
2. **Uhno Lingo U-NO** — color/number shedding-card prototype with draw, skip, reverse, +2, and wild concepts. House rules are simplified; stacking, challenge rules, exact deck distribution, and full reverse/turn-order logic require approval.
3. **Cashman Lingo Mania** — five-reel virtual slot prototype using a disclosed test paytable. A spin costs 10 local demo Play Coins. Payouts are fixed for test purposes, not an approved production paytable or certified RTP.
4. **Lions Lingo Eruptions** — 7×7 match puzzle prototype with adjacent swaps, score, and a 20-move limit. Cascades and refill behavior are simplified and need further QA.

## UX / functions
- Arcade catalog with game launch buttons, game-specific controls, restart actions, live status text, demo wallet, and cosmetic-only store.
- Keyboard and screen-reader review is still required; buttons use native elements, but complete accessibility QA has not been performed.
- Responsive dark crimson/black studio styling and reduced-motion media query.
- Browser-local persistence only; localStorage is editable by the player and is not a secure ledger or account sync.

## Economy and safety
- Play Coins are fictional, non-redeemable demo points with no cash value.
- No deposits, withdrawals, paid spins, cash-out, real-money wagering, or prizes are implemented.
- The store unlocks cosmetic demo items only. Items are not purchased with money.
- Production balances and game outcomes must be server-authoritative with authentication, idempotency, atomic ledger transactions, abuse controls, and audit logs before a public launch.

## Test plan / acceptance gates
- Spades: follow-suit enforcement, trump winner, trick ties, all 13 tricks, contract scoring, bot hand exhaustion.
- U-NO: color/value matching, wild color selection, draw deck exhaustion, action-card turn effects, empty-hand win, bot win, invalid play rejection.
- Cashman: stake deduction, leftmost consecutive match calculation, each symbol/count payout, no-win path, insufficient balance, overflow bounds, reset behavior.
- Lions: horizontal/vertical match detection, adjacency, no-match rollback, score, move limit, refill, no infinite loop, small-screen controls.
- Store: insufficient funds, one-time unlock, reload persistence, local data corruption.
- Global: keyboard navigation, reduced motion, screen reader announcements, mobile viewport, no console errors, storage failure, deterministic seeded math tests.
- Current status: prototype code is authored in this branch but **not executed or browser-tested**. CI and G02 release authorization are not bypassed.
