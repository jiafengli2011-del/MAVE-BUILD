import { createHash } from 'node:crypto';
import { gunzipSync } from 'node:zlib';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, extname, join, resolve } from 'node:path';
import { ROUTES } from './routes.mjs';

const ROOT = resolve(process.cwd());
const ASSET_DIR = 'generated-assets';

const MIME_EXTENSIONS = new Map([
  ['image/png', '.png'],
  ['image/jpeg', '.jpg'],
  ['image/webp', '.webp'],
  ['image/gif', '.gif'],
  ['image/svg+xml', '.svg'],
  ['font/woff2', '.woff2'],
  ['font/woff', '.woff'],
  ['text/css', '.css'],
  ['application/json', '.json'],
  ['text/javascript', '.js'],
  ['application/javascript', '.js'],
]);

function scriptPayload(html, type, required = true) {
  const marker = `<script type="${type}">`;
  const start = html.indexOf(marker);
  if (start === -1) {
    if (!required) return null;
    throw new Error(`missing ${marker}`);
  }
  const contentStart = start + marker.length;
  const end = html.indexOf('</script>', contentStart);
  if (end === -1) throw new Error(`missing closing script tag for ${type}`);
  return html.slice(contentStart, end).trim();
}

function decodeResource(entry) {
  const encoded = Buffer.from(entry.data, 'base64');
  return entry.compressed ? gunzipSync(encoded) : encoded;
}

function runtimeTarget(bytes) {
  const sample = bytes.toString('utf8');
  if (sample.includes('__dcBoot') && sample.includes('DCLogic')) return '/support.js';
  if (/customElements\.define\(["']image-slot["']/.test(sample)) return '/image-slot.js';
  if (sample.includes('@license React') && sample.includes('react-dom')) return '/vendor/react-dom.production.min.js';
  if (sample.includes('@license React')) return '/vendor/react.production.min.js';
  return null;
}

function replaceAllLiteral(text, find, replacement) {
  return text.split(find).join(replacement);
}

function normalizeInternalLinks(template) {
  const links = new Map([
    ['index.html', '/'],
    ['Home%20Page.dc.html', '/'],
    ['Side%20Page_Hearth%20Studio.dc.html', '/models/hearth-studio'],
    ['Side Page_Hearth Studio.dc.html', '/models/hearth-studio'],
    ['Side%20Page_Grove%20Loft.dc.html', '/models/grove-studio'],
    ['Side Page_Grove Loft.dc.html', '/models/grove-studio'],
    ['Side%20Page_Hearth%20One%20Bedroom.dc.html', '/models/hearth-one-bedroom'],
    ['Side Page_Hearth One Bedroom.dc.html', '/models/hearth-one-bedroom'],
    ['Side%20Page_Hearth%20Pod.dc.html', '/models/hearth-pod'],
    ['Side Page_Hearth Pod.dc.html', '/models/hearth-pod'],
    ['Side%20Page_Grove%20Pod.dc.html', '/models/grove-pod'],
    ['Side Page_Grove Pod.dc.html', '/models/grove-pod'],
    ['Resources.dc.html', '/resources'],
    ['Resources_How%20Much%20Does%20a%20Modular%20ADU%20Cost.dc.html', '/resources/how-much-does-a-modular-adu-cost'],
    ['Resources_How Much Does a Modular ADU Cost.dc.html', '/resources/how-much-does-a-modular-adu-cost'],
  ]);
  return template.replace(/href=(['"])([^'"]+)\1/g, (whole, quote, href) => {
    const [path, suffix = ''] = href.split(/(?=[?#])/u, 2);
    const normalized = links.get(path);
    return normalized ? `href=${quote}${normalized}${suffix}${quote}` : whole;
  });
}

async function extract(route) {
  if (!route.bundle) return;

  const bundle = await readFile(join(ROOT, route.bundle), 'utf8');
  const manifest = JSON.parse(scriptPayload(bundle, '__bundler/manifest'));
  const external = JSON.parse(scriptPayload(bundle, '__bundler/ext_resources', false) || '[]');
  let template = JSON.parse(scriptPayload(bundle, '__bundler/template'));
  const replacements = new Map();

  for (const [uuid, entry] of Object.entries(manifest)) {
    const bytes = decodeResource(entry);
    const knownRuntime = entry.mime.includes('javascript') ? runtimeTarget(bytes) : null;
    if (knownRuntime) {
      replacements.set(uuid, knownRuntime);
      continue;
    }

    const extension = MIME_EXTENSIONS.get(entry.mime) || extname(uuid) || '.bin';
    const digest = createHash('sha256').update(bytes).digest('hex').slice(0, 20);
    const relative = `${ASSET_DIR}/${digest}${extension}`;
    await mkdir(join(ROOT, ASSET_DIR), { recursive: true });
    await writeFile(join(ROOT, relative), bytes);
    replacements.set(uuid, `/${relative}`);
  }

  for (const item of external) {
    if (/\/react-dom@/.test(item.id)) replacements.set(item.uuid, '/vendor/react-dom.production.min.js');
    else if (/\/react@/.test(item.id)) replacements.set(item.uuid, '/vendor/react.production.min.js');
  }

  for (const [from, to] of replacements) template = replaceAllLiteral(template, from, to);
  template = template
    .replaceAll('https://unpkg.com/react@18.3.1/umd/react.production.min.js', '/vendor/react.production.min.js')
    .replaceAll('https://unpkg.com/react-dom@18.3.1/umd/react-dom.production.min.js', '/vendor/react-dom.production.min.js');
  template = normalizeInternalLinks(template);

  if (!template.includes('<x-dc>') || !template.includes('data-dc-script')) {
    throw new Error(`${route.bundle}: extracted template is not a Design Component source page`);
  }
  if (/["'(]?[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i.test(template)) {
    throw new Error(`${route.bundle}: unresolved bundled resource id remains after extraction`);
  }

  const out = join(ROOT, route.source);
  await mkdir(dirname(out), { recursive: true });
  await writeFile(out, template, 'utf8');
  console.log(`  ${route.bundle} -> ${route.source}`);
}

console.log('extracting Claude Design bundles:');
for (const route of ROUTES) await extract(route);
console.log('bundle extraction done.');
