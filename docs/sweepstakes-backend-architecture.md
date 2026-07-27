# Sweepstakes Backend Architecture

This is a backend design note for a future sweepstakes service. It should not be activated until official rules, privacy disclosures, AMOE parity, and legal review are complete.

## Recommended Vercel architecture

- Next.js App Router on Vercel for authenticated admin and entry endpoints.
- Prisma for typed database access.
- Neon via the Vercel Marketplace for relational Postgres, because Vercel Postgres is no longer first-party and existing Vercel Postgres databases were migrated to Neon via the Vercel Marketplace in December 2024.
- Vercel Web Analytics for campaign funnel events that contain no sensitive personal data.
- Vercel environment variables for database and admin secrets.

## Core tables

- `Participant`: email, legacy ID, eligibility status, consent timestamps.
- `Entry`: participant ID, source, count, AMOE flag, timestamp, campaign ID.
- `EntryAuditLog`: action, before/after, request metadata, admin ID, timestamp.
- `PrizeTier`: tier, ARV, winner count, fulfillment rules.
- `Winner`: participant ID, prize tier, drawnAt, notification status, affidavit status.
- `Disqualification`: participant ID, reason, evidence, reviewer, timestamp.

## Endpoint requirements

- Public entry endpoints must validate campaign dates, eligibility, rate limits, AMOE limits, and source rules.
- Admin draw endpoints must require strong authentication and produce immutable audit logs.
- Social verification endpoints must avoid scraping private data and must follow platform rules.
- Purchase attribution must not change odds unless AMOE parity is implemented and audited.

## Anti-fraud requirements

- Rate-limit by account, IP, and device/browser signals where legally permitted.
- Detect duplicate accounts, scripted submissions, impossible gameplay milestones, and purchase manipulation.
- Keep disqualification procedures consistent with official rules.
- Retain entry and winner records for the rules-defined period.

## Safe implementation note

The previously proposed minimal code examples are useful as a prototype shape, but production must add authentication, authorization, schema constraints, campaign scoping, audit logging, AMOE parity checks, fraud review, deterministic draw records, privacy controls, and legal-approved official rules before launch.
