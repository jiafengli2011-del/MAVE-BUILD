import { access, readFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { ROUTES } from './routes.mjs';

const ROOT = resolve(process.cwd());
let failed = false;

function plainText(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

for (const route of ROUTES) {
  const file = join(ROOT, route.out);
  const html = await readFile(file, 'utf8');
  const snapshotStart = html.indexOf('<!-- PRERENDER:START -->');
  const snapshotEnd = html.indexOf('<!-- PRERENDER:END -->');
  const snapshot = snapshotStart >= 0 && snapshotEnd > snapshotStart
    ? html.slice(snapshotStart, snapshotEnd)
    : '';
  const text = plainText(snapshot);
  const checks = {
    snapshot: snapshot.includes('id="__prerender"'),
    title: /<title>[^<]+<\/title>/.test(html),
    description: html.includes('name="description"'),
    canonical: html.includes(`href="${route.canonical}"`),
    structuredData: html.includes('application/ld+json'),
    enoughText: text.length >= route.minText,
    noJsGate: !text.includes('This page requires JavaScript to display'),
    noTemplateTokens: !snapshot.includes('{{'),
    imageRuntime: !/<(?:x-import|image-slot)\b/i.test(html) || html.includes('<script src="/image-slot.js"></script>'),
  };

  const referencedAssets = [
    ...html.matchAll(/(?:src|href)="\/(generated-assets\/[^"?#]+)/g),
    ...html.matchAll(/url\(["']?\/(generated-assets\/[^"')?#]+)/g),
  ].map((match) => match[1]);
  for (const asset of new Set(referencedAssets)) {
    try {
      await access(join(ROOT, asset));
    } catch {
      checks[`asset:${asset}`] = false;
    }
  }

  const missing = Object.entries(checks).filter(([, ok]) => !ok).map(([name]) => name);
  if (missing.length) {
    failed = true;
    console.error(`FAIL ${route.canonical}: ${missing.join(', ')}`);
  } else {
    console.log(`PASS ${route.canonical} — ${text.length} readable characters`);
  }
}

if (failed) process.exitCode = 1;
