# YuGO Rides – www.yugorides.in

Public marketing website for YuGO Rides Pvt. Ltd. (EV scooter rentals with battery swapping, Pune/PCMC).

## Structure

Single-page site with working section links (Rental plans, How it works, About, FAQs, Franchise, Contact) plus draft Privacy and Terms pages and a 404 page.
A single page was chosen because the content is short and conversion-focused: one URL to share, no duplicated headers/footers to maintain, and every call-to-action is one scroll away.

```
index.html            Home page (all sections)
privacy.html          Privacy notice – DRAFT, noindex, needs owner/legal approval
terms.html            Terms of use – DRAFT, noindex, needs owner/legal approval
404.html              Not-found page (GitHub Pages serves it automatically)
assets/css/styles.css Hand-written CSS (no framework, no build step)
assets/js/main.js     Mobile menu, footer year, franchise form (inactive until connected)
assets/img/           Logo, scooter cut-out, favicons, social share image (all local)
CNAME                 www.yugorides.in (GitHub Pages custom domain)
_backend/             Google Apps Script for the franchise form (not published)
scripts/check.py      Local QA: links, assets, responsive overflow, menu, form flow
```

## Run locally

No build step is needed – the site is plain HTML, CSS and JS.

```
python3 -m http.server 8080      # then open http://localhost:8080
```

QA checks (needs `pip install playwright && playwright install chromium`):

```
python3 scripts/check.py
```

## Franchise form

The form is hidden until a real destination is set, so no enquiry is ever accepted and lost.
Visitors see call / WhatsApp / email options instead.

To turn it on:
1. Signed in as sales.yugorides@gmail.com, create a Google Sheet "YuGO Rides Franchise Enquiries".
2. Extensions → Apps Script → paste `_backend/franchise-enquiries.gs` → Save.
3. Deploy → New deployment → Web app → Execute as **Me**, Who has access **Anyone** → Deploy → authorise.
4. Copy the web-app URL into `ENQUIRY_ENDPOINT` at the top of `assets/js/main.js` and publish.
Each enquiry is then added as a row in the sheet and emailed to sales.yugorides@gmail.com.

## Deploy (GitHub Pages + GoDaddy DNS)

1. Push these files to a GitHub repository (e.g. `yugorides-website`), branch `main`.
2. Repository → Settings → Pages → Source: Deploy from a branch → `main` / root.
3. Custom domain: `www.yugorides.in` (the CNAME file sets this) → tick **Enforce HTTPS** once the certificate is issued.
4. GoDaddy → yugorides.in → DNS:
   - Remove domain forwarding / parking and any old `A` record for `@` and the `CNAME` for `www`.
   - Add `A` records for `@`: 185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153
   - Add `CNAME` `www` → `<github-username>.github.io`
5. DNS can take up to a few hours; then both yugorides.in and www.yugorides.in load over HTTPS.

## Factual corrections made from the Stitch export

- Removed invented figures: "Avg Swap 1m 54s", ₹250–₹350 daily fuel loss, "30% of gross earnings", "3–4 hours charging downtime", "55+ km/h top speed", product name "YuGO Thunder EV".
- Removed unconfirmed promises: "zero lock-in deposits", "zero swap fees", "100% complete mechanical maintenance", free roadside support, "unlimited daily station access", live station/network status, station-coverage claims, delivery-platform partner logos (Zomato, Swiggy, Zepto, Blinkit, Porter, Dunzo), "15–30 minute verification", specific KYC documents.
- Removed all old 7/15/28-day poster prices; only the two current plans are shown, with the exact rates supplied.
- Replaced every address (Viman Nagar Industrial Hub / Pune–Ahmednagar Highway, etc.) with 235 Navi Peth, Near Bakhale Classes, Pune 411030.
- Swap time and range are shown only as typical/advertised (about 2 minutes, 70–75 km per swap) with a caveat.
- Service area limited to Pune and PCMC; no nationwide claims.
- Replaced the fake form success with a real (but switched-off) submission flow; nothing claims "we will WhatsApp you".
- Hamburger menu now works; app-style bottom tab bar and `href="#"` links removed; Privacy/Terms are real draft pages.
- Tailwind Play CDN removed; remote Google/Stitch image URLs and the Unsplash fallback replaced with local assets.
- Added page title, meta description, Open Graph tags, favicon, structured data; zoom is no longer disabled.
- Copyright year is generated automatically.

## Still to complete before launch

- Terms & Conditions and Privacy notice are drafts: have a lawyer review them, then fill in the [bracketed] items (approval date, CIN, Grievance Officer name, grievance email) and remove the draft banners.
- Franchise form: connect it to the Google Sheet (steps above) or it stays hidden.
- Franchise investment ranges in the form dropdown (₹5 lakh bands) are placeholders – adjust if needed.
- A higher-resolution scooter cut-out would look sharper on high-density phone screens (current one is 199×336 px).

## Confirmed by owner (13 Oct 2026)

- Phone numbers: +91 80805 13935 (also WhatsApp) and +91 91753 24002.
- KYC is completed automatically in the app; maintenance is done by YuGO.
- Rider plans follow the Franchise Programme 2026 brochure (confirmed 21 Oct 2026): Light Rider ₹1,550/week with 75 km/day included, ₹2/km above 75 km/day; Heavy Rider ₹69/day + ₹1.50/km with a ₹1,550/week minimum.
