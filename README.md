# StackPilot

Independent reviews and comparisons of AI and automation tools for small businesses — an affiliate content site, with a tools marketplace planned as the next phase.

**Live:** https://stackpilot-s14h.vercel.app

## What this is

StackPilot publishes plain-English reviews and comparisons (e.g. Make vs. Zapier, best AI tools for small business) aimed at SMB owners evaluating software. Revenue comes from affiliate commissions on the tools reviewed, routed through the `/go/*.html` redirect pages so links can be swapped or tracked without editing article content.

## Structure

- `index.html` — homepage
- - `articles/` — published guides and comparisons
  - - `go/` — one redirect page per affiliate program (HubSpot, Monday.com, ClickUp, Apollo.io, Surfer SEO, Make, Zapier, Notion, Semrush, Clay) — each points to the real affiliate tracking link once that program is approved
    - - `robots.txt`, `sitemap.xml` — SEO basics
      - - `vercel.json` — deployment config
        - - `LAUNCH.md` — the step-by-step launch checklist: deploy, affiliate registration, email capture, analytics, first traffic, and the content roadmap
         
          - ## Status
         
          - - Site is built and deployed to Vercel (production).
            - - Affiliate program applications are in progress — see `LAUNCH.md` for the full list and current state of each `/go/` link.
              - - Email capture (Brevo), GA4, and Search Console setup are still pending — flagged inline in `index.html`.
               
                - ## Goal
               
                - Grow to $20,000+/month in pure profit through affiliate commissions, with a tools marketplace as a second revenue stream once content and traffic are established. See `LAUNCH.md` for month-by-month revenue targets.
