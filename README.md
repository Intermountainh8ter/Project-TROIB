# TROIB — Tri-Regional Ocean Infrastructure Blueprint

The official investor-facing website for **TROIB**, a multi-regional infrastructure
framework that harnesses the ocean's thermal, chemical, and physical properties across
three U.S. maritime zones — the **Gulf of Mexico**, **Southeast Florida**, and
**Southern California** — to deliver zero-emission baseload power, AI data-center cooling,
freshwater, and critical minerals.

🌐 **Live site:** https://troip.xyz

---

## Design

The site uses a bespoke **"Thermal Gradient"** concept — the page reads as a descent from
the warm sunlit ocean surface into the cold abyss, mirroring how Ocean Thermal Energy
Conversion (OTEC) actually works. A scroll "depth gauge" tracks your descent from 0 m to
~3,000 m (the depth of the cold-water intake pipes).

**Palette** — abyssal navy · bioluminescent teal · thermal coral · mineral gold
**Type** — `Syne` (display) · `Space Grotesk` (body) · `Space Mono` (data)

No frameworks, no build step — hand-written **HTML + CSS + vanilla JS**. Highlights:

- Animated marine-snow / bioluminescence canvas backdrop (respects `prefers-reduced-motion`)
- Scroll-reveal animations and easing count-up statistics
- Interactive three-region tab explorer with animated regional art
- Animated stacked financial pro-forma chart driven by the executive-summary data
- Fully responsive with an accessible mobile menu

## Project structure

```
.
├── index.html            # single-page investor site
├── 404.html              # themed not-found page
├── assets/
│   ├── favicon.svg       # thermal-gradient depth-pipe mark
│   ├── css/style.css     # full design system
│   └── js/main.js        # canvas, counters, tabs, chart, reveals
├── CNAME                 # custom domain (troip.xyz) for GitHub Pages
├── .nojekyll             # serve assets verbatim (no Jekyll)
├── robots.txt
└── sitemap.xml
```

## Local preview

It's a static site — open `index.html` directly, or serve it:

```bash
python3 -m http.server 8080
# then visit http://localhost:8080
```

---

## Deployment — GitHub Pages + custom domain (`troip.xyz`)

This repo is wired for **GitHub Pages**. The `CNAME` file already points the build at
`troip.xyz`.

### 1. Enable Pages
In the GitHub repo: **Settings → Pages → Build and deployment → Source: Deploy from a
branch**, then select the branch this site lives on and the `/ (root)` folder. Save.

### 2. Point your DNS at GitHub Pages
At your domain registrar / DNS host for **troip.xyz**, create the following records.

**Apex domain `troip.xyz` — four A records (IPv4):**

| Type | Host / Name | Value           |
|------|-------------|-----------------|
| A    | `@`         | `185.199.108.153` |
| A    | `@`         | `185.199.109.153` |
| A    | `@`         | `185.199.110.153` |
| A    | `@`         | `185.199.111.153` |

**Optional but recommended — AAAA records (IPv6):**

| Type | Host / Name | Value                  |
|------|-------------|------------------------|
| AAAA | `@`         | `2606:50c0:8000::153`  |
| AAAA | `@`         | `2606:50c0:8001::153`  |
| AAAA | `@`         | `2606:50c0:8002::153`  |
| AAAA | `@`         | `2606:50c0:8003::153`  |

**`www` subdomain — CNAME:**

| Type  | Host / Name | Value                          |
|-------|-------------|--------------------------------|
| CNAME | `www`       | `intermountainh8ter.github.io` |

> Replace `intermountainh8ter.github.io` only if the repository owner's GitHub username
> differs. The format is always `<github-username>.github.io`.

### 3. Finish in GitHub
Back in **Settings → Pages**, set **Custom domain** to `troip.xyz` (this is what the `CNAME`
file does automatically) and tick **Enforce HTTPS** once the certificate is issued.

DNS can take anywhere from a few minutes to ~24 hours to propagate. Check progress with:

```bash
dig troip.xyz +short
dig www.troip.xyz +short
```

When the A records resolve to the `185.199.108–111.153` range, you're live at
**https://troip.xyz**.

> **Alternative host (Vercel/Netlify):** since this is a plain static site, you can also drop
> the whole repo onto Vercel or Netlify. In that case skip the GitHub Pages A records and
> instead follow the host's DNS instructions (typically a CNAME for `www` plus an
> A/ALIAS record for the apex that they provide).

---

## Updating content

All copy, figures, and forecasts live directly in `index.html`. The financial chart data is
defined once in `assets/js/main.js` (the `FIN` object) so the bars and the table stay in sync.

---

_Forward-looking projections in this site are illustrative and do not constitute an offer to
sell securities._
