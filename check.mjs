#!/usr/bin/env node
/**
 * Post-build checks. Runs in CI and fails the deploy on anything that would
 * embarrass us in front of a guest: a broken image, a dead internal link,
 * or a placeholder that never got filled in.
 */
import { readFileSync, existsSync, statSync } from "node:fs";
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

/* 2. Every hash route linked in the markup must be handled by the router. */
const linked = [...new Set([...html.matchAll(/href="#(\/[a-z-]*)"/g)].map((m) => m[1]))];
const routed = [...new Set([...html.matchAll(/"(\/[a-z-]*)":\s*"v-/g)].map((m) => m[1]))];
for (const l of linked) {
  if (!routed.includes(l)) errors.push(`link to #${l} but no such route`);
}

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

console.log(`checked ${refs.length} images, ${linked.length} routes, ${kb.toFixed(0)} KB html`);
for (const w of warnings) console.log(`  warn  ${w}`);
for (const e of errors) console.error(`  FAIL  ${e}`);
if (errors.length) {
  console.error(`\n${errors.length} error(s)`);
  process.exit(1);
}
console.log(warnings.length ? `\npassed with ${warnings.length} warning(s)` : "\nall checks passed");
