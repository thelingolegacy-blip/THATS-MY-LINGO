# Lingo Legacy — Phase 3 Expansion Master Specification

Release target: Android beta / virtual entertainment platform

## Canonical systems

### Tournaments
- Daily categories: highest virtual winnings, most spins, XP gained.
- Weekly ladder: top 100 players.
- Rewards: 1st 10,000 Loyalty Bucks; 2nd 5,000; 3rd 2,500; top 100 tournament badge.
- Required state: tournamentScore, weeklyRank, rewardClaimed, seasonId, periodStart, periodEnd.
- UI scene contract: TournamentPanel, LeaderboardPanel, RewardPanel, CountdownTimer, ClaimButton.

### Daily Bonus
- One claim per UTC calendar day.
- Streak counter with safe reset after missed day.
- Reward table must be server-authoritative when backend persistence is enabled.
- Never award cash or cash-equivalent value.

### Achievements
Spin: 100, 500, 1,000, 10,000.
Wins: first jackpot, 50 wins, 500 wins.
Quiz: 10 correct, 100 correct, 50 streak.
Spades: first win, 50 games, Spades Legend.
Rewards: XP, virtual coins, Loyalty Bucks, cosmetic badges.

### Profile V2
Display username, avatar, level, XP progress, total spins, lifetime virtual coins, highest virtual win, current streak, achievements, badges, titles, and frames.

### Economy
- Demo Coins: gameplay and bonus games.
- Loyalty Bucks: store/cosmetic progression.
- Lingo Tokens: premium-facing virtual currency only until legal/compliance review approves any monetization model.
- No paid spins, deposits, withdrawals, cash-out, or cash-equivalent redemption.

### Anti-cheat telemetry
Track session time, ads watched, spin frequency, coins earned, XP/minute, reward claims, and anomalous request frequency.
Flags: suspiciousActivity, possibleAutoClicker, impossibleWinRate, impossibleRewardVelocity.
Flags are review signals, not automatic accusations or punitive actions without evidence.

### Analytics
Capture DAU, retention, session duration, spins/day, game mix, tournament participation, reward engagement, ad events, and store clicks. Do not collect unnecessary sensitive personal data.

### Kotton's Code — Episode 1
Title: The First Key at Loyalty Lane.
Maps: bedroom, kitchen, yard, neighborhood, school.
Characters: Kotton, Kimba, Jada, Zavione.
Systems: choices, XP, mini-games, collectibles.
Rewards: Code Keys, badges, Memory Pages.

### Phase 4 foundation
Keep multiplayer contracts modular: players, rooms, matches, leaderboards, inventory, dailyRewards. Synchronization fields: x, y, animation, direction, avatar, level. Room operations: create, join, leave, quick match, private match.

## Release gates
1. Build from known-good source.
2. Static validation and smoke tests pass.
3. No secrets in source or URLs.
4. Economy remains virtual-only.
5. Authentication and persistence are tested separately from demo mode.
6. Mobile layout and reduced-motion behavior are verified.
7. Exact artifact is tagged with commit SHA and release manifest.
8. Rollback target is recorded before promotion.
9. Manual Android beta checklist is completed before distribution.

## Deployment strategy
AppDeploy deployment is currently blocked by its lifetime deployment quota. GitHub is the source-of-truth artifact path for this expansion. Cloudflare/Vercel can consume the repository afterward through a normal connected deployment workflow.
