# Games Studio Release System

Studio Mode stays on for That’s My Lingo and every Games-world release. The quality bar is cinematic, premium, and Industrial Noir even when the infrastructure stays free-tier.

## Release stages

1. **Staging** — every change starts in a pull request or preview deployment.
2. **QA Review** — validate links, assets, metadata, scripts, mobile layout, and accessibility basics.
3. **Studio Review** — confirm motion, lighting, typography, color, cards, and interaction polish match the Games identity.
4. **Production Deployment** — merge only after validation and review pass.
5. **Monitoring** — watch Vercel Web Analytics, Speed Insights, deployment health, and reported errors after launch.
6. **Iteration** — fixes return to staging, pass QA and Studio Review, then ship.

## Required release gate

Run a static smoke audit before merge. The gate must check JSON config, sitemap URLs, local links/assets, anchor targets, inline script syntax, page titles, and meta descriptions.

## Games QA checklist

- Homepage includes canonical metadata, social metadata, Web Analytics, and Speed Insights scripts.
- `404.html`, `manifest.webmanifest`, `robots.txt`, `sitemap.xml`, and `vercel.json` are present.
- Buttons, cards, readiness checks, and launch capture work without backend credentials.
- No secret, API token, or credential appears in static HTML.
- Mobile and desktop preserve the Industrial Noir Games visual system.

## 48-hour post-launch cycle

- Check pageviews, LCP, CLS, INP, and FCP after production deploy.
- Log any visual, motion, interaction, or performance issue against the Games world.
- Fix in staging, validate again, review motion and mobile, then redeploy.
