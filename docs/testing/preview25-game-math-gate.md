# Preview 2.5 game-math gate

## Purpose
This is a pre-integration verification layer. It is not a replacement for the existing GDevelop runtime, a production game server, or the approved rules/paytable. The reference engine contains pure deterministic evaluation functions so the rules can be reviewed separately from rendering and animation.

## Run locally
Requires Node.js 22 or a compatible modern Node.js release.

```sh
node --test tests/game-math.test.mjs
python scripts/tml_quality_gate.py
```

The CI workflow runs these commands in separate jobs. A green result is meaningful only if the job has a real assigned runner, executes steps, and exposes retrievable logs. A pre-step failure is an infrastructure failure, not a pass or a code-level test failure.

## Covered assertions
- A standard deck has 52 unique rank/suit pairs; shuffle preserves the deck composition.
- Poker evaluation supports 5–7 cards, rejects duplicate physical cards, evaluates all nine standard hand categories, compares kicker tuples, and handles the ace-low wheel as five-high.
- Blackjack total calculation accounts for aces as 11 or 1 and distinguishes bust, soft total, and two-card 21. Reference settlement uses 3:2 net blackjack profit (total returned is stake plus profit), ordinary wins return 2× stake, pushes return stake, and losses return zero.
- Slot payout evaluation uses an injected grid, paylines, and explicit paytable. It is a deterministic evaluator; it does not generate reel outcomes or define the actual game paytable.
- Virtual-round settlement rejects invalid or unaffordable wagers, prevents negative balances, and treats repeated round IDs as idempotent.

## Rules that still require product-owner approval
1. Confirm the poker variant (the reference evaluator ranks 5-card poker combinations and selects the best five from 5–7 cards).
2. Confirm blackjack rules: dealer soft-17 policy, split/double/insurance behavior, surrender, natural-blackjack treatment, and payout policy.
3. Replace test-only slot symbols and multipliers with the approved Preview 2.5 paytable and confirm line/wager aggregation and rounding.
4. Confirm the round lifecycle and how virtual balance is persisted. The in-memory helper is not a secure ledger.
5. Add browser integration tests against the actual Preview 2.5 DOM and UI after its source is available on this branch.

## Security boundary
Client-side code cannot be authoritative for balances or outcomes. Before public launch, move random outcome generation and settlement to an authenticated server-side function, validate requests and idempotency keys server-side, and use atomic ledger transactions. Play Coins must remain fictional and non-redeemable. No cash-out, deposits, or conversion of virtual balances into sweepstakes entries is implemented or implied here.

## Current execution status
The GitHub Actions runner has been failing before step initialization (`runner_id: 0`, empty runner name, no steps, and missing log blobs). The test source is authored, but the CI result is **unverified** until the jobs execute on an assigned runner and produce logs. Track remediation in GitHub issue #27.
