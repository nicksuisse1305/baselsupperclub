# Basel Supper Club

The website for [baselsupperclub.ch](https://baselsupperclub.ch) — a supper club in a
Basel flat. Six to eight seats, one long table.

Static site, no framework, no runtime dependencies. Push to `main` and CI builds,
checks and deploys it.

---

## Quick start

```bash
npm run dev      # build + serve at http://localhost:8080
npm run build    # build dist/ (the live site)
npm run check    # verify the build
npm run ci       # build + check, exactly what CI runs
```

Node 18+. Nothing to install — the build script has no dependencies.

---

## Changing the site

Almost everything you'll want to edit lives in **`src/content.js`**: prices, evenings
and their menus, the six cuisines, the FAQ, the timeline, gallery captions.

Common edits:

| I want to… | Edit |
| --- | --- |
| Change a price | `P_DINNER` / `P_DRINKS` at the top of `src/content.js` |
| Add an evening or set a date | the `EVENINGS` array — set `when` to a real date and `status` to `"open"` |
| Change a menu | the `courses` array on that evening |
| Add a cuisine | the `CUISINES` array (add a flag to `FLAGS` if it's a new country) |
| Add or answer a question | the `FAQ` array |
| Add a food photo | drop the file in `assets/gallery/food/` — it appears automatically |
| Add a guest photo | drop the file in `assets/gallery/guests/` — same |
| Change how many gallery slots show | `FOOD_SLOTS` / `GUEST_SLOTS` in `src/content.js` |
| Change wording on a page | `src/index.html` |
| Change the look | `src/styles.css` |
| Change the headline font | `SITE.font` in `build.mjs` — `fraunces`, `instrument`, `archivo` or `anton` |

Then:

```bash
git add -A && git commit -m "Add October dates" && git push
```

CI deploys within about a minute.

---

## Layout

```
├── assets/
│   ├── img/             layout photographs, referenced by filename in code
│   └── gallery/
│       ├── food/        drop food photos here — auto-discovered, no code change
│       └── guests/      drop guest photos here — same
├── src/
│   ├── index.html       page markup, all views
│   ├── styles.css       the whole stylesheet
│   ├── content.js       ← the file you'll edit most
│   └── app.js           rendering, hash router, gallery, booking form
├── build.mjs            the build
├── check.mjs            post-build verification
└── .github/workflows/   CI/CD
```

`dist/` and `dist-artifact/` are build output and are not committed.

---

## Build targets

`npm run build:all` produces two things from the same source:

- **`dist/`** — the live site. Images as separate files, full `<head>` with Open
  Graph and structured data, `CNAME`, `robots.txt`, `sitemap.xml`.
- **`dist-artifact/`** — one self-contained HTML file with every image inlined as a
  data URI, for sharing a preview link. ~3.6 MB, deliberately.

CSS and JS are inlined into `index.html` (~92 KB). For a single-page site that's one
request instead of three, and it removes the render-blocking waterfall. The images
are the heavy part and they stay external, lazy-loaded and cacheable.

---

## Checks

`npm run check` fails the build on anything that would embarrass us in front of a
guest, and warns about anything unfinished:

- every referenced image exists in the build
- every `#/route` link has a matching route in the router
- doctype, `lang`, Open Graph image and structured data are present
- `favicon.svg`, `robots.txt`, `sitemap.xml`, `CNAME` all exist
- the HTML stays under a 250 KB budget

Warnings (non-fatal) flag placeholder contact details, empty photo slots and
evenings without real dates.

---

## Still to do

- [ ] Real Instagram link (currently points at instagram.com)
- [ ] Photos of Nik and Ania cooking — two empty slots on the About page
- [ ] Actual dates for the four evenings
- [ ] Replace the `mailto:` booking form with a real endpoint (Formspree or Resend)
      and wire up Twint / Stripe

---

## Adding photos

Drop image files into `assets/gallery/food/` or `assets/gallery/guests/`, commit
and push. They render on the next deploy — there is nothing to edit in code.

- Accepted: `.jpg` `.jpeg` `.png` `.webp`
- The filename becomes the caption: `smoked-duck-leg.jpg` → "Smoked duck leg"
- Files show in filename order, so prefix with `01-`, `02-` to control it
  (the number is stripped from the caption)
- Roughly 1500px on the long edge, under 400 KB each

The gallery shows `FOOD_SLOTS` tiles (30) and `GUEST_SLOTS` tiles (5). Real
photos fill them first; the rest stay as placeholders, so the wall always looks
deliberate rather than half-finished.
