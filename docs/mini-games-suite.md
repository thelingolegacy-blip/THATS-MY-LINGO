# LINGO Mini Games — Updated Preview Specification

## Creative direction

Four separate arcade identities under the That’s My Lingo studio umbrella. Shared presentation uses smoked crimson, black, white, metallic accents, responsive controls, and fictional non-redeemable Play Coins. Inspiration is genre-level only; logos, characters, artwork, names, and distinctive assets must remain original.

## Game concepts and current implementation

1. **Spades Is My Lingo+** — target direction is a four-seat partnership Spades game with team bidding, nil bids, bags, contract scoring, partner-aware bots, difficulty settings, and round history. The current code remains a simplified trick-taking prototype: it enforces follow-suit and uses spades as trump, but does not implement the complete Spades+ scoring and strategy package.
2. **Uhno Lingo U-NO** — distinct LINGO palette: coral, electric teal, lime, and violet. Standard matching-card inspiration with original action concepts: Switch-Up (change active color), Color Clash (penalty draw), and Wild Echo (repeat a color effect). The current prototype changes colors and applies simplified penalty draws; complete action-card turn states, legal deck distribution, and formal rules are not yet implemented.
3. **Cashman Lingo Mania** — five-reel local virtual slot with provisional test paytable. Added an initial emoji-based Cashman mascot placeholder to establish the direction: a young adult streetwear character with hoodie/cap, chain, sneakers, expressive reactions, and LINGO attitude. This is not finished character art. Paytable values are not approved production math or certified RTP.
4. **Lions Lingo Eruptions** — changed from swap-match tiles to a reveal-and-row prototype. Balls begin hidden; tapping reveals a ball. A horizontal row of three or more matching revealed balls scores points and clears the row into new hidden balls. Longer rows receive a bonus. Current build uses 24 reveals and local scoring; vertical matches, cascades, special balls, and full balancing remain future work.

## UX and functions

- Arcade catalog and direct links to each game, native buttons, live status text, restart controls, local demo wallet, and cosmetic-only store.
- Spades uses a standard 52-card deck, four seats, follow-suit checks, and a simplified trick winner.
- U-NO uses custom colors and action concepts, but current rules are a prototype and need deterministic unit tests.
- Cashman uses five virtual reels and local demo Play Coins; mascot art is a placeholder.
- Lions uses hidden/revealed ball states, horizontal row detection, point feedback, and a finite reveal count.
- Browser-local persistence only; localStorage is player-editable and is not a secure ledger or account sync.
- Responsive dark styling and reduced-motion media query. Full accessibility and device QA remain pending.

## Economy and safety

- Play Coins are fictional, non-redeemable demo points with no cash value.
- No deposits, withdrawals, paid spins, cash-out, real-money wagering, or prizes are implemented.
- Store items are local cosmetic demo unlocks only.
- Production balances and game outcomes must be server-authoritative with authentication, idempotency, atomic ledger transactions, abuse controls, and audit logs before any public launch.

## Test plan / acceptance gates

- **Spades+:** follow-suit enforcement, trump winner, trick ties, all 13 tricks, team contract scoring, nil/bag rules, partner bot behavior, hand exhaustion.
- **U-NO:** matching, color selection, each custom action, turn order, draw exhaustion, invalid play rejection, bot win, empty-hand win.
- **Cashman:** stake deduction, leftmost consecutive match calculation, each symbol/count payout, no-win path, insufficient balance, overflow bounds, reset behavior, mascot layout.
- **Lions:** reveal state, horizontal row detection, score for 3/4/5+ balls, no duplicate scoring, hidden refill, reveal limit, mobile taps.
- **Store/global:** insufficient funds, one-time unlock, reload persistence, keyboard navigation, reduced motion, screen-reader announcements, small viewport, no console errors, storage failure, deterministic seeded math tests.
- **Current status:** changes are authored on the feature branch and **have not been executed in a browser or through CI**. G02 remains blocked; this work does not bypass release gates.
