import { createServer } from 'node:http';
import { readFile, writeFile, mkdir, stat } from 'node:fs/promises';
import { extname, join, resolve } from 'node:path';
import puppeteer from 'puppeteer';
import { ROUTES } from './routes.mjs';

const ROOT = resolve(process.cwd());
const PORT = 4321;

const CDN_PREFIX = 'https://cdn.jsdelivr.net/gh/jiafengli2011-del/MAVE-BUILD@main/';
/** Runtime files served from this checkout rather than the CDN. */
const LOCAL_ASSETS = ['support.js', 'image-slot.js'];
const LOCAL_URL_ASSETS = new Map([
  ['https://unpkg.com/react@18.3.1/umd/react.production.min.js', 'vendor/react.production.min.js'],
  ['https://unpkg.com/react-dom@18.3.1/umd/react-dom.production.min.js', 'vendor/react-dom.production.min.js'],
]);
const DEBUG_DIR = 'prerender-debug';
const OFFLINE = process.env.PRERENDER_OFFLINE === '1';

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json',
  '.css': 'text/css',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
};

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

function structuredData(route) {
  const publisher = { '@type': 'Organization', name: 'MAVE', url: 'https://mavebuild.com/' };
  if (route.product) {
    return {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: route.product.name,
      description: route.description,
      url: route.canonical,
      brand: { '@type': 'Brand', name: 'MAVE' },
      category: 'Modular home and accessory dwelling unit',
      floorSize: {
        '@type': 'QuantitativeValue',
        value: route.product.floorSize,
        unitCode: 'FTK',
        unitText: 'square feet',
      },
      offers: {
        '@type': 'Offer',
        url: route.canonical,
        priceCurrency: 'USD',
        price: route.product.price,
      },
    };
  }
  return {
    '@context': 'https://schema.org',
    '@type': route.schemaType || 'WebPage',
    name: route.title,
    headline: route.schemaType === 'Article' ? route.title : undefined,
    description: route.description,
    url: route.canonical,
    publisher,
  };
}

function routeHead(route) {
  const schema = JSON.stringify(structuredData(route)).replaceAll('<', '\\u003c');
  return `<title>${escapeHtml(route.title)}</title>
<meta name="description" content="${escapeHtml(route.description)}">
<link rel="canonical" href="${escapeHtml(route.canonical)}">
<meta property="og:type" content="website">
<meta property="og:title" content="${escapeHtml(route.title)}">
<meta property="og:description" content="${escapeHtml(route.description)}">
<meta property="og:url" content="${escapeHtml(route.canonical)}">
<meta name="twitter:card" content="summary_large_image">
<script type="application/ld+json">${schema}</script>`;
}

function serve() {
  return new Promise((ready) => {
    const server = createServer(async (req, res) => {
      try {
        const path = decodeURIComponent(new URL(req.url, 'http://x').pathname);
        const file = join(ROOT, path);
        const info = await stat(file);
        if (!info.isFile()) throw new Error('not a file');
        res.writeHead(200, { 'content-type': MIME[extname(file)] || 'application/octet-stream' });
        res.end(await readFile(file));
      } catch {
        res.writeHead(404).end('not found');
      }
    });
    server.listen(PORT, () => ready(server));
  });
}

/**
 * Fail immediately with a useful error if a runtime file was accidentally
 * replaced by an HTML page. Without this guard Puppeteer waits for a mount
 * that can never happen and only reports a generic 60-second timeout.
 */
async function validateRuntimeAssets() {
  const support = await readFile(join(ROOT, 'support.js'), 'utf8');
  const imageSlot = await readFile(join(ROOT, 'image-slot.js'), 'utf8');

  if (/^\s*</.test(support) || !support.includes('DCLogic: runtime.StreamableLogic') || !support.includes('__dcBoot')) {
    throw new Error(
      'support.js is not the Design Component JavaScript runtime. ' +
      'It may have been overwritten with an HTML page; restore the real runtime before prerendering.'
    );
  }
  if (/^\s*</.test(imageSlot) || !imageSlot.includes("customElements.define('image-slot'")) {
    throw new Error('image-slot.js is not the expected image-slot JavaScript component.');
  }

  for (const rel of LOCAL_URL_ASSETS.values()) {
    const source = await readFile(join(ROOT, rel), 'utf8');
    if (/^\s*</.test(source)) throw new Error(`${rel} contains HTML instead of JavaScript.`);
  }
}

/** Pull the <x-dc> template + logic script out of the source, verbatim. */
function extractRuntimeBlock(src) {
  const start = src.indexOf('<x-dc>');
  const scriptOpen = src.indexOf('<script type="text/x-dc" data-dc-script>', start);
  const scriptClose = src.indexOf('</script>', scriptOpen);
  if (start === -1 || scriptOpen === -1 || scriptClose === -1) {
    throw new Error('could not locate <x-dc> template and data-dc-script block');
  }
  return src.slice(start, scriptClose + '</script>'.length);
}

/**
 * Finds the element the runtime actually rendered into, without assuming a
 * fixed id. The generated page also contains a static `.sc-host` inside
 * `#__prerender`, so every candidate must explicitly exclude that snapshot.
 * Otherwise the hydration cleanup mistakes the snapshot for the live React
 * tree and deletes the only visible content before the runtime mounts.
 *
 * Injected verbatim into page contexts — keep it self-contained ES5.
 */
const FIND_ROOT = `function __findRoot() {
  var snapshot = document.getElementById('__prerender');
  function outsideSnapshot(node) {
    return !!node && (!snapshot || !snapshot.contains(node));
  }
  var dcRoot = document.getElementById('dc-root');
  if (outsideSnapshot(dcRoot)) return dcRoot;
  var hosts = document.querySelectorAll('.sc-host');
  for (var i = 0; i < hosts.length; i++) {
    if (outsideSnapshot(hosts[i])) return hosts[i];
  }
  var annotated = document.querySelectorAll('[data-dc-tpl]');
  for (var j = 0; j < annotated.length; j++) {
    if (outsideSnapshot(annotated[j])) return annotated[j];
  }
  return null;
}`;

/**
 * Removes the prerendered snapshot the instant the runtime mounts its own
 * tree, so the two never coexist visibly. No styles are applied or changed —
 * the node is detached outright.
 */
const HYDRATION_CLEANUP = `<script>
(function () {
  ${FIND_ROOT}
  var snapshot = document.getElementById('__prerender');
  if (!snapshot) return;
  function live() {
    var root = __findRoot();
    return root && root.firstElementChild;
  }
  function drop() {
    if (snapshot && snapshot.parentNode) snapshot.parentNode.removeChild(snapshot);
    snapshot = null;
  }
  if (live()) return drop();
  var observer = new MutationObserver(function () {
    if (live()) { observer.disconnect(); drop(); }
  });
  observer.observe(document.body, { childList: true, subtree: true });
})();
</script>`;

async function prerender(browser, route) {
  const src = await readFile(join(ROOT, route.source), 'utf8');
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 1000 });

  // Diagnostics — collected for the whole render, dumped if the wait fails.
  const consoleErrors = [];
  const pageErrors = [];
  const failedRequests = [];
  page.on('console', (m) => {
    if (m.type() === 'error' || m.type() === 'warning') {
      consoleErrors.push(`[${m.type()}] ${m.text()}`);
    }
  });
  page.on('pageerror', (e) => pageErrors.push(String(e && e.message ? e.message : e)));
  page.on('requestfailed', (r) => {
    failedRequests.push(`${r.failure()?.errorText || 'failed'} ← ${r.url()}`);
  });
  page.on('response', (r) => {
    if (r.status() >= 400) failedRequests.push(`HTTP ${r.status()} ← ${r.url()}`);
  });

  // The source pins support.js / image-slot.js to jsDelivr @main. On a feature
  // branch those files may not exist on main yet, and jsDelivr caches 404s
  // hard — so serve them straight from this checkout. Fulfilling the request
  // with the file bytes is deterministic; rewriting the request URL across
  // origins is not. Affects only what the browser fetches while rendering —
  // x-import URLs inside the emitted component remain unchanged.
  await page.setRequestInterception(true);
  page.on('request', async (req) => {
    const url = req.url();
    const localUrlAsset = LOCAL_URL_ASSETS.get(url);
    if (localUrlAsset) {
      try {
        const body = await readFile(join(ROOT, localUrlAsset));
        return req.respond({
          status: 200,
          contentType: 'text/javascript; charset=utf-8',
          headers: { 'access-control-allow-origin': '*' },
          body,
        });
      } catch (err) {
        failedRequests.push(`local asset missing: ${localUrlAsset} (${err.message})`);
        return req.abort();
      }
    }
    if (url.startsWith(CDN_PREFIX)) {
      const rel = url.slice(CDN_PREFIX.length).split('?')[0];
      if (LOCAL_ASSETS.includes(rel)) {
        try {
          const body = await readFile(join(ROOT, rel));
          return req.respond({
            status: 200,
            contentType: 'text/javascript; charset=utf-8',
            headers: { 'access-control-allow-origin': '*' },
            body,
          });
        } catch (err) {
          failedRequests.push(`local asset missing: ${rel} (${err.message})`);
          return req.abort();
        }
      }
    }
    // Used only for local verification in restricted environments. GitHub
    // Actions does not set this flag and continues to load normal page assets.
    if (OFFLINE && /^https?:/.test(url) && !url.startsWith(`http://localhost:${PORT}/`)) {
      return req.abort();
    }
    req.continue();
  });

  await page.goto(`http://localhost:${PORT}/${route.source}`, { waitUntil: 'networkidle2', timeout: 60000 });

  // Wait for the real render container — resolved by selector, not a
  // hardcoded id (see FIND_ROOT).
  try {
    await page.waitForFunction(
      `(() => { ${FIND_ROOT}
        const root = __findRoot();
        return !!(root && root.firstElementChild && root.textContent.trim().length > 500);
      })()`,
      { timeout: 60000 }
    );
  } catch (err) {
    await dumpFailure(page, route, { consoleErrors, pageErrors, failedRequests });
    throw err;
  }
  await page.evaluate(() => document.fonts && document.fonts.ready);

  const { head, body } = await page.evaluate(`(() => { ${FIND_ROOT}
    const root = __findRoot();
    // Drop the runtime's own script tags from the captured head; they are
    // re-added deterministically below.
    const headClone = document.head.cloneNode(true);
    headClone.querySelectorAll('script:not([type="application/ld+json"])').forEach((s) => s.remove());
    headClone.querySelectorAll('title').forEach((s) => s.remove());
    headClone.querySelectorAll('meta[name="description"], link[rel="canonical"], meta[property^="og:"], meta[name^="twitter:"]').forEach((s) => s.remove());

    // Claude Design's image-slot renders its real <img> inside Shadow DOM.
    // innerHTML cannot serialize a shadow root, which previously left a
    // correctly-sized but empty hero area in the static snapshot. Replace
    // image components only in the clone with ordinary images; the live
    // runtime tree below remains untouched and keeps all interactions.
    const bodyClone = root.cloneNode(true);
    bodyClone.querySelectorAll('image-slot, x-import').forEach((slot) => {
      const src = slot.getAttribute('src');
      if (!src) return;
      const img = document.createElement('img');
      img.setAttribute('src', src);
      img.setAttribute('alt', slot.getAttribute('placeholder') || '');
      const className = slot.getAttribute('class');
      const style = slot.getAttribute('style');
      const fit = slot.getAttribute('fit') || 'cover';
      const radius = slot.getAttribute('radius');
      if (className) img.setAttribute('class', className);
      img.setAttribute(
        'style',
        (style ? style.replace(/;?\\s*$/, ';') : '') +
          'display:block;object-fit:' + fit + ';' +
          (radius !== null ? 'border-radius:' + radius + 'px;' : '')
      );
      slot.replaceWith(img);
    });
    return { head: headClone.innerHTML, body: bodyClone.innerHTML };
  })()`);
  await page.close();

  const sourceSupportSrc = (src.match(/<script src="([^"]*support\.js)"><\/script>/) || [])[1];
  if (!sourceSupportSrc) throw new Error('could not find the support.js script tag in ' + route.source);

  // The source points at jsDelivr @main, but a TEST deployment must run the
  // runtime from its own checkout. This also prevents a bad or stale main
  // branch file from blanking an otherwise valid static snapshot.
  const supportSrc = '/support.js';

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
${routeHead(route)}
${head.trim()}
<script src="${supportSrc}"></script>
</head>
<body>
<!-- PRERENDER:START --><div id="__prerender">${body}</div><!-- PRERENDER:END -->
${extractRuntimeBlock(src)}
${HYDRATION_CLEANUP}
</body>
</html>
`;

  const outPath = join(ROOT, route.out);
  await mkdir(join(outPath, '..'), { recursive: true });
  await writeFile(outPath, html, 'utf8');

  const visibleText = body.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  console.log(
    `  ${route.out} — ${(html.length / 1024).toFixed(0)} KB, ${visibleText.length} chars of text in the initial response`
  );
  if (visibleText.length < route.minText) {
    throw new Error(`${route.out}: suspiciously little prerendered text (${visibleText.length} < ${route.minText})`);
  }
  if (!html.includes('id="__prerender"') || !html.includes(route.title) || !html.includes(route.canonical)) {
    throw new Error(`${route.out}: generated HTML is missing required crawlable metadata or snapshot`);
  }
  return html;
}

/**
 * Called when the mount wait times out. Reports which stage of the boot chain
 * was reached — support.js executed → React loaded → __dcBoot ran → content
 * rendered — so the failure point is visible without another round trip.
 */
async function dumpFailure(page, route, logs) {
  console.error(`\n✗ ${route.out} — timed out waiting for the page to render.\n`);

  let state = {};
  try {
    state = await page.evaluate(`(() => { ${FIND_ROOT}
      const root = __findRoot();
      return {
        supportJsLoaded: typeof window.__dcBoot === 'function',
        reactLoaded: !!window.React,
        reactDomLoaded: !!window.ReactDOM,
        bootRan: !!root,
        rootDesc: root ? root.tagName.toLowerCase() + (root.id ? '#' + root.id : '') + (root.className ? '.' + String(root.className).trim().split(/\\s+/).join('.') : '') : '(none)',
        hasDcRootId: !!document.getElementById('dc-root'),
        hasScHost: !!document.querySelector('.sc-host'),
        xDcStillPresent: !!document.querySelector('x-dc'),
        renderedTextLength: root ? root.textContent.trim().length : 0,
        rootChildren: root ? root.children.length : 0,
        readyState: document.readyState,
      };
    })()`);
  } catch (e) {
    console.error('  could not read page state:', e.message);
  }

  console.error('  boot chain:');
  const stages = [
    ['support.js executed  (window.__dcBoot)', state.supportJsLoaded],
    ['React loaded         (window.React)', state.reactLoaded],
    ['ReactDOM loaded      (window.ReactDOM)', state.reactDomLoaded],
    ['__dcBoot ran         (render container found)', state.bootRan],
    ['content rendered     (>500 chars)', state.renderedTextLength > 500],
  ];
  for (const [label, ok] of stages) console.error(`    ${ok ? 'ok  ' : 'FAIL'}  ${label}`);
  console.error(
    `  container: ${state.rootDesc || '(none)'}  [#dc-root: ${state.hasDcRootId ? 'yes' : 'no'}, .sc-host: ${state.hasScHost ? 'yes' : 'no'}]`
  );
  console.error(
    `  rendered text: ${state.renderedTextLength || 0} chars in ${state.rootChildren || 0} child element(s), readyState=${state.readyState}`
  );
  if (state.xDcStillPresent) {
    console.error('  note: <x-dc> is still in the DOM — the runtime never took over.');
  }

  const section = (title, list) => {
    if (!list.length) return;
    console.error(`\n  ${title} (${list.length}):`);
    for (const line of list.slice(0, 25)) console.error(`    ${line}`);
    if (list.length > 25) console.error(`    …and ${list.length - 25} more`);
  };
  section('page errors', logs.pageErrors);
  section('failed / error responses', logs.failedRequests);
  section('console errors and warnings', logs.consoleErrors);

  const slug = route.out.replace(/[\/\\]/g, '_');
  try {
    await mkdir(join(ROOT, DEBUG_DIR), { recursive: true });
    await page.screenshot({ path: join(ROOT, DEBUG_DIR, `${slug}.png`), fullPage: true });
    await writeFile(join(ROOT, DEBUG_DIR, `${slug}.html`), await page.content(), 'utf8');
    console.error(`\n  wrote ${DEBUG_DIR}/${slug}.png and ${DEBUG_DIR}/${slug}.html\n`);
  } catch (e) {
    console.error(`  could not write debug artifacts: ${e.message}\n`);
  }
}

await validateRuntimeAssets();
const server = await serve();
const browser = await puppeteer.launch({
  headless: true,
  args: ['--no-sandbox', '--disable-dev-shm-usage'],
});
console.log(`prerendering ${ROUTES.length} route(s):`);
try {
  for (const route of ROUTES) await prerender(browser, route);
} finally {
  await browser.close();
  server.close();
}
console.log('done.');
