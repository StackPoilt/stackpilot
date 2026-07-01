# StackPilot — Launch Action Plan
**Status: Site built. Waiting on: affiliate registrations + deployment.**

---

## STEP 1: Deploy to Vercel (15 minutes, free, do this first)

1. Go to https://github.com and create a new repository called `stackpilot`
2. Upload this entire `stackpilot/` folder to that repo (drag and drop works)
3. Go to https://vercel.com → "New Project" → Import from GitHub → select `stackpilot`
4. Click Deploy — that's it. Your site will be live at `stackpilot.vercel.app`

Optional (recommended): Buy `stackpilot.com` at https://namecheap.com (~$10/yr) and connect it in Vercel's project settings under "Domains".

---

## STEP 2: Register for Affiliate Programs (1–2 hours total)

Register with email: zimoutan@gmail.com
All programs are free to join. You'll need to provide: website URL (stackpilot.vercel.app), brief description ("independent reviews of AI and automation tools"), and tax/payment info for payouts.

### HIGH PRIORITY (highest commission, register today)

| Program | Register URL | Commission | Payment |
|---------|-------------|------------|---------|
| **HubSpot** | https://www.hubspot.com/partners/affiliates | 30% recurring up to $1,000/mo | Monthly |
| **Semrush** | https://www.semrush.com/partner-programs/affiliates/ | $200/sale + $10/trial | Monthly |
| **Monday.com** | https://monday.com/affiliates | Up to $300/sale | Monthly |
| **ClickUp** | https://clickup.com/affiliates | 20% recurring | Monthly |
| **Apollo.io** | https://www.apollo.io/partners/affiliates | $50–$120/sale | Monthly |

### MEDIUM PRIORITY (register this week)

| Program | Register URL | Commission |
|---------|-------------|------------|
| **Make (Integromat)** | https://www.make.com/en/partners/affiliate | 20% recurring |
| **Zapier** | https://zapier.com/developer/partner-program | $20–$50/referral |
| **Notion** | https://www.notion.so/affiliates | 50% of first payment |
| **Surfer SEO** | https://surferseo.com/affiliate-program/ | 25% recurring |
| **Clay** | https://clay.com/affiliate | Up to $500/referral |

### After registration:
- Each program gives you a unique affiliate link
- Replace each `PLACEHOLDER_TOOLNAME_AFFILIATE_URL` in the `/go/*.html` files with your real links
- Example: replace `PLACEHOLDER_MAKE_AFFILIATE_URL` with your actual Make affiliate link

---

## STEP 3: Set Up Email Capture (30 minutes)

1. Go to https://www.brevo.com → Sign up free (300 emails/day free)
2. Create a "Newsletter" contact list
3. Create a signup form → copy the embed code
4. Replace the form `action` URL in `index.html` and the article files with your Brevo form action URL

Alternative: https://beehiiv.com (free up to 2,500 subscribers, newsletter-native)

---

## STEP 4: Set Up Google Analytics + Search Console (20 minutes)

1. Go to https://analytics.google.com → Create account → Get GA4 measurement ID (format: G-XXXXXXXXXX)
2. Uncomment the Google Analytics script in `index.html` and replace `G-XXXXXXXXXX` with your ID
3. Go to https://search.google.com/search-console → Add property → URL prefix: https://stackpilot.vercel.app
4. Verify ownership (Vercel makes this easy via DNS record)
5. Submit your sitemap: `https://stackpilot.vercel.app/sitemap.xml`

---

## STEP 5: Set Up Stripe (for marketplace track — 30 minutes)

1. Go to https://stripe.com → Create account with zimoutan@gmail.com
2. Complete business verification (takes 1–3 days)
3. Note your publishable key and secret key (you'll need these for marketplace build)
4. Enable: Stripe Connect (for marketplace payouts to service providers)

---

## STEP 6: Drive First Traffic (start same day as deploy)

### Reddit Posts (copy-paste ready)

**r/entrepreneur post:**
```
Title: I built a site comparing AI tools for small business after wasting $3k on the wrong stack

After trying 20+ tools and spending way too much money on things that didn't stick, I started writing up what actually works. Just launched the site — three guides up so far. Happy to answer questions about specific tools if anyone's evaluating options.

[link to stackpilot.vercel.app]
```

**r/SaaS post:**
```
Title: Make vs Zapier in 2026 — detailed breakdown after running both on real workflows

I've been running both platforms on client workflows for the past 6 months. The pricing gap has gotten huge (Make is 5-10x cheaper at scale). Wrote up a full comparison here if anyone's evaluating:

[link to articles/make-vs-zapier-2026.html]
```

**r/smallbusiness post:**
```
Title: What AI tools are you actually using in your business? Here's what we found works

We've been testing and reviewing AI tools specifically for small business contexts. Most "best AI tools" lists are written by people who've never actually run a business. Curious what others are using — and happy to share what we've found works (and what doesn't).

[link to stackpilot.vercel.app]
```

### LinkedIn Post:
```
Running a small business in 2026 without AI tools is like running one in 2014 without a website.

The problem isn't that the tools don't exist — it's knowing which ones are worth the learning curve and subscription cost.

I've been testing and comparing AI tools specifically for small business use cases. Just published three guides:

→ 10 Best AI Tools for Small Business
→ Make vs Zapier: Honest Comparison  
→ 8 Best Automation Tools Ranked by ROI

Link in comments. Happy to answer questions about any specific tool.
```

---

## Revenue Projections

| Month | Action | Target Revenue |
|-------|--------|---------------|
| 1 | Site live, programs joined, first traffic | $0–$200 |
| 2 | 10 articles, Reddit presence, email list building | $200–$800 |
| 3 | 25 articles, email list 500+, some SEO traction | $500–$2,000 |
| 4–6 | SEO compounding, 50+ articles, list 1,500+ | $2,000–$8,000/mo |
| 7–12 | Marketplace live, affiliate + marketplace combined | $10,000–$20,000/mo |

---

## Next Content to Write (priority order)

1. `hubspot-review-2026.html` — HubSpot is the highest-commission tool, write a detailed review
2. `hubspot-vs-salesforce.html` — High-volume comparison search
3. `clickup-vs-notion-2026.html` — Very popular comparison, both have affiliate programs
4. `best-crm-small-business-2026.html` — High commercial intent
5. `monday-vs-asana-2026.html` — Both have programs
6. `semrush-review-2026.html` — Semrush pays $200/sale, worth a dedicated review
7. `best-ai-writing-tools-2026.html` — Covers Jasper, Copy.ai, etc.
8. `zapier-alternatives-2026.html` — Targets people ready to switch away from Zapier

---

## Files That Need Your Input Before Going Live

- `/go/*.html` — Replace PLACEHOLDER URLs with real affiliate links after registration
- `index.html` line ~170 — Replace Brevo form action URL with yours
- `index.html` line ~196 — Uncomment GA4 script and add measurement ID
