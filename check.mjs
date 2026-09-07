#!/usr/bin/env node
/**
 * Post-build checks. Runs in CI and fails the deploy on anything that would
 * embarrass us in front of a guest: a broken image, a dead internal link,
 * or a placeholder that never got filled in.
 */
import { readFileSync, existsSync, statSync, readdirSync } from "node:fs";
import { join } from "node:path";

const DIST = "dist";
const html = readFileSync(join(DIST, "index.html"), "utf8");
const errors = [];
const warnings = [];

/* 1. Every image the page references must actually exist in the build. */
const refs = [...new Set([...html.matchAll(/["'(](img\/[^"')]+)["')]/g)].map((m) => m[1]))];
for (const r of refs) {
  if (!existsSync(join(DIST, r))) errors.push(`missing image: ${r}`);
}
if (refs.length === 0) errors.push("no images referenced — the image map failed to build");

/* 1b. Every gallery/host image the page references must exist in the build.
       The manifest and the copy step used to be written separately, and a photo
       that failed to convert stayed in the manifest and 404'd. */
for (const r of [...new Set([...html.matchAll(/"(gallery\/[^"]+)"/g)].map((m) => m[1]))]) {
  if (!existsSync(join(DIST, r))) errors.push(`page references ${r} but it is not in the build`);
}

/* 2. Every hash route linked in the markup must be handled — either by the
      router (a view) or by a modal the router opens over the current page. */
const MODAL_ROUTES = ["/book"];
const linked = [...new Set([...html.matchAll(/href="#(\/[a-z-]*)"/g)].map((m) => m[1]))];
const routed = [...new Set([...html.matchAll(/"(\/[a-z-]*)":\s*"v-/g)].map((m) => m[1]))];
for (const l of linked) {
  if (!routed.includes(l) && !MODAL_ROUTES.includes(l)) {
    errors.push(`link to #${l} but no such route`);
  }
}
/* the modal routes must actually have their container in the page */
if (!html.includes('id="bookmodal"')) errors.push("booking modal container is missing");

/* 3. Required document furniture. */
for (const [needle, label] of [
  ["<!doctype html>", "doctype"],
  ['<html lang="en"', "lang attribute"],
  ["og:image", "Open Graph image"],
  ["application/ld+json", "structured data"],
]) {
  if (!html.includes(needle)) errors.push(`missing ${label}`);
}
for (const f of ["favicon.svg", "robots.txt", "sitemap.xml", "CNAME"]) {
  if (!existsSync(join(DIST, f))) errors.push(`missing ${f}`);
}

/* 3b. Thumbnails must actually be thumbnails. If the resize tool is missing on
       the build machine the code silently falls back to copying the original,
       which ships megabytes into a grid of small tiles. */
let thumbBytes = 0;
for (const dir of ["food", "guests"]) {
  const tdir = join(DIST, "gallery", dir, "thumb");
  if (!existsSync(tdir)) continue;
  for (const f of readdirSync(tdir)) {
    const t = statSync(join(tdir, f)).size;
    thumbBytes += t;
    const fullPath = join(DIST, "gallery", dir, f);
    if (existsSync(fullPath) && t >= statSync(fullPath).size * 0.9) {
      errors.push(`thumb gallery/${dir}/thumb/${f} is not smaller than the full image — the resize tool is missing`);
    }
    if (t > 200 * 1024) {
      errors.push(`thumb gallery/${dir}/thumb/${f} is ${(t / 1024).toFixed(0)} KB (budget 200 KB)`);
    }
  }
}

/* 3c. Host portraits go through the same resize; a phone original is ~3 MB. */
for (const f of (existsSync(join(DIST, "gallery", "hosts")) ? readdirSync(join(DIST, "gallery", "hosts")) : [])) {
  const size = statSync(join(DIST, "gallery", "hosts", f)).size;
  if (size > 600 * 1024) {
    errors.push(`gallery/hosts/${f} is ${(size / 1024).toFixed(0)} KB (budget 600 KB) — not resized`);
  }
}

/* 3c2. Nothing undisplayable may ship. Phones produce HEIC named .jpg, which
       no mainstream browser renders — so verify by magic number, not name. */
function sniff(p) {
  const head = readFileSync(p).subarray(0, 16);
  if (head[0] === 0xff && head[1] === 0xd8) return "jpeg";
  if (head.subarray(0, 8).equals(Buffer.from([0x89,0x50,0x4e,0x47,0x0d,0x0a,0x1a,0x0a]))) return "png";
  if (head.subarray(0, 4).toString("latin1") === "RIFF") return "webp";
  if (head.subarray(4, 8).toString("latin1") === "ftyp") return "heic";
  return "unknown";
}
function walk(dir) {
  let out = [];
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) out = out.concat(walk(p));
    else if (/\.(jpe?g|png|webp)$/i.test(e.name)) out.push(p);
  }
  return out;
}
for (const p of ["img", "gallery"].flatMap((d) => (existsSync(join(DIST, d)) ? walk(join(DIST, d)) : []))) {
  const kind = sniff(p);
  if (kind !== "jpeg" && kind !== "png" && kind !== "webp") {
    errors.push(`${p.replace(DIST + "/", "")} is ${kind}, not a web image — browsers will not render it`);
  }
}

/* 3e. Source images must be web formats. A phone will happily hand you a HEIC
       named ".jpg"; the build cannot always decode it, and losing a photo
       silently is worse than refusing to ship. */
for (const dir of ["assets/gallery/food", "assets/gallery/guests", "assets/gallery/hosts", "assets/img"]) {
  if (!existsSync(dir)) continue;
  for (const f of readdirSync(dir)) {
    if (!/\.(jpe?g|png|webp|heic|heif)$/i.test(f)) continue;
    if (sniff(join(dir, f)) === "heic") {
      errors.push(`${dir}/${f} is HEIC. Re-export it as JPEG (on iPhone: Settings > Camera > Formats > Most Compatible) and re-upload.`);
    }
  }
}

/* 4. Placeholders that must not reach production. */
const placeholders = [
  [/https:\/\/instagram\.com"/, "Instagram link still points at instagram.com"],
  [/Add a photo/, "empty photo slots are still on the page"],
  [/Date announced soon/, "evenings still have no real dates"],
];
for (const [re, msg] of placeholders) if (re.test(html)) warnings.push(msg);

/* 5. Weight budget — the HTML is inlined, so keep an eye on it. */
const kb = statSync(join(DIST, "index.html")).size / 1024;
if (kb > 250) errors.push(`index.html is ${kb.toFixed(0)} KB (budget 250 KB)`);

console.log(`checked ${refs.length} images, ${linked.length} routes, ${kb.toFixed(0)} KB html, ` +
  `${(thumbBytes / 1024 / 1024).toFixed(1)} MB of thumbnails`);
for (const w of warnings) console.log(`  warn  ${w}`);
for (const e of errors) console.error(`  FAIL  ${e}`);
if (errors.length) {
  console.error(`\n${errors.length} error(s)`);
  process.exit(1);
}
console.log(warnings.length ? `\npassed with ${warnings.length} warning(s)` : "\nall checks passed");
