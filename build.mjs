#!/usr/bin/env node
/**
 * Basel Supper Club — build.
 *
 * Two targets from one source tree:
 *   web       dist/            images as files, full <head>, for baselsupperclub.ch
 *   artifact  dist-artifact/   single self-contained file, images inlined as
 *                              data URIs, no <head> (the Artifact host supplies it)
 *
 * No dependencies — plain Node.
 */
import { readFileSync, writeFileSync, mkdirSync, rmSync, copyFileSync, readdirSync } from "node:fs";
import { join, extname, basename } from "node:path";

const SITE = {
  name: "Basel Supper Club",
  title: "Basel Supper Club — Eight seats, one table",
  origin: "https://baselsupperclub.ch",
  domain: "baselsupperclub.ch",
  description:
    "A supper club in a Basel flat. Six to eight seats at one long table — ramen, curry, " +
    "pasta, gyoza and whatever kitchen we're obsessing over. CHF 120, or CHF 150 with drinks.",
  ogImage: "/img/hero.jpg",
  ogImageAlt: "A bowl of tantan with soft egg, greens and mince",
  font: "anton", // headline face: fraunces | instrument | archivo | anton
};

const SRC = "src";
const IMG = "assets/img";
const read = (p) => readFileSync(p, "utf8");

/* Every image the site can reference. `hero2` is an alias so the gallery and the
   hero can share one file without shipping the bytes twice. */
function imageMap(mode) {
  const files = readdirSync(IMG).filter((f) => /\.(jpe?g|png|webp)$/i.test(f)).sort();
  const entries = files.map((f) => {
    const key = basename(f, extname(f));
    if (mode === "artifact") {
      const mime = extname(f).toLowerCase() === ".png" ? "image/png" : "image/jpeg";
      return [key, `data:${mime};base64,${readFileSync(join(IMG, f)).toString("base64")}`];
    }
    return [key, `img/${f}`];
  });
  const obj = entries.map(([k, v]) => `${k}: ${JSON.stringify(v)}`).join(",\n");
  return `window.IMAGES = {\n${obj}\n};\nwindow.IMAGES.hero2 = window.IMAGES.hero;\n`;
}

function head() {
  const abs = (p) => SITE.origin + p;
  return `<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${SITE.title}</title>
<meta name="description" content="${SITE.description}">
<link rel="canonical" href="${SITE.origin}/">
<meta name="theme-color" content="#131110">

<meta property="og:type" content="website">
<meta property="og:site_name" content="${SITE.name}">
<meta property="og:title" content="${SITE.title}">
<meta property="og:description" content="${SITE.description}">
<meta property="og:url" content="${SITE.origin}/">
<meta property="og:image" content="${abs(SITE.ogImage)}">
<meta property="og:image:alt" content="${SITE.ogImageAlt}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${SITE.title}">
<meta name="twitter:description" content="${SITE.description}">
<meta name="twitter:image" content="${abs(SITE.ogImage)}">

<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="${SITE.ogImage}">
<link rel="preload" as="image" href="${SITE.ogImage}" fetchpriority="high">

<script type="application/ld+json">
${JSON.stringify({
  "@context": "https://schema.org",
  "@type": "Restaurant",
  name: SITE.name,
  url: SITE.origin + "/",
  image: abs(SITE.ogImage),
  description: SITE.description,
  servesCuisine: ["Japanese", "Indian", "Italian", "Thai", "Chinese", "Polish"],
  priceRange: "CHF 120–150",
  address: { "@type": "PostalAddress", addressLocality: "Basel", addressCountry: "CH" },
  email: "hello@" + SITE.domain,
  acceptsReservations: "True",
  maximumAttendeeCapacity: 8,
}, null, 1)}
</script>`;
}

const FONTS =
  '<link rel="preconnect" href="https://fonts.googleapis.com">\n' +
  '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n' +
  '<link rel="stylesheet" href="https://fonts.googleapis.com/css2' +
  "?family=Fraunces:opsz,wght@9..144,600;9..144,700" +
  "&family=Instrument+Serif:ital@0;1" +
  "&family=Archivo:wght@600;700;800" +
  "&family=Anton" +
  "&family=Familjen+Grotesk:ital,wght@0,400;0,500;0,600;1,400" +
  '&display=swap">';

const FAVICON = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
<rect width="64" height="64" fill="#131110"/>
<path d="M10 30h44a22 22 0 0 1-44 0Z" fill="#E2542B"/>
<path d="M6 30h52" stroke="#E2542B" stroke-width="4" stroke-linecap="round"/>
<path d="M22 22c0-5 4-6 4-10M32 22c0-5 4-6 4-10M42 22c0-4 3-5 3-8" stroke="#F7F2EA" stroke-width="3.4" stroke-linecap="round" fill="none"/>
</svg>`;

function build(mode) {
  const out = mode === "artifact" ? "dist-artifact" : "dist";
  rmSync(out, { recursive: true, force: true });
  mkdirSync(out, { recursive: true });

  const bundle =
    `<style>\n${read(join(SRC, "styles.css"))}\n</style>\n\n` +
    `${read(join(SRC, "index.html"))}\n\n` +
    `<script>\n${imageMap(mode)}</script>\n` +
    `<script>\n${read(join(SRC, "content.js"))}\n</script>\n` +
    `<script>\n${read(join(SRC, "app.js"))}\n</script>\n`;

  if (mode === "artifact") {
    // The Artifact host wraps this in its own <html>/<head>, so ship the
    // fragment only — but it does read <title> and needs the font <link>.
    writeFileSync(
      join(out, "index.html"),
      `<meta charset="utf-8">\n<title>${SITE.name}</title>\n${FONTS}\n\n${bundle}`
    );
  } else {
    writeFileSync(
      join(out, "index.html"),
      `<!doctype html>\n<html lang="en" data-font="${SITE.font}">\n<head>\n` +
        `${head()}\n${FONTS}\n</head>\n<body>\n${bundle}</body>\n</html>\n`
    );
    mkdirSync(join(out, "img"), { recursive: true });
    for (const f of readdirSync(IMG)) copyFileSync(join(IMG, f), join(out, "img", f));
    writeFileSync(join(out, "favicon.svg"), FAVICON);
    writeFileSync(join(out, "CNAME"), SITE.domain + "\n");
    writeFileSync(join(out, "robots.txt"), `User-agent: *\nAllow: /\nSitemap: ${SITE.origin}/sitemap.xml\n`);
    writeFileSync(
      join(out, "sitemap.xml"),
      `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
        `<url><loc>${SITE.origin}/</loc><priority>1.0</priority></url>\n</urlset>\n`
    );
  }

  const kb = (readFileSync(join(out, "index.html")).length / 1024).toFixed(0);
  console.log(`  ${mode.padEnd(9)} → ${out}/index.html  ${kb} KB`);
}

const modes = process.argv[2] ? [process.argv[2]] : ["web", "artifact"];
console.log("Building Basel Supper Club");
modes.forEach(build);
