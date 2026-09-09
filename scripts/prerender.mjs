import { createServer } from 'node:http';
import { readFile, writeFile, mkdir, stat } from 'node:fs/promises';
import { extname, join, resolve } from 'node:path';
import puppeteer from 'puppeteer';

const ROOT = resolve(process.cwd());
const PORT = 4321;

const CDN_PREFIX = 'https://cdn.jsdelivr.net/gh/jiafengli2011-del/MAVE-BUILD@main/';
/** Runtime files served from this checkout rather than the CDN. */
const LOCAL_ASSETS = ['support.js', 'image-slot.js'];
const DEBUG_DIR = 'prerender-debug';

/**
 * One entry per route. `source` is the Design Component source page;
 * `out` is the static file Vercel serves. `head` is the SEO metadata that
 * previously lived only in the bundled export's <head> — it is NOT present
 * in the source page, so it must be declared here or it is lost.
 */
const ROUTES = [
  {
    source: 'src/models/hearth-studio.dc.html',
    out: 'models/hearth-studio/index.html',
    canonical: 'https://mavebuild.com/models/hearth-studio',
    head: `<title>Hearth Studio — 375 sq ft ADU Modular Home | MAVE BUILD</title>
<meta name="description" content="A 375 sq ft studio ADU with kitchen, bath, living and sleeping in one footprint, starting at $65,000. Rental-ready, sleeps 1–2." />`,
  },
];

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
};

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
 * Removes the prerendered snapshot the instant the runtime mounts its own
 * tree, so the two never coexist visibly. No styles are applied or changed —
 * the node is detached outright.
 */
const HYDRATION_CLEANUP = `<script>
(function () {
  var snapshot = document.getElementById('__prerender');
  if (!snapshot) return;
  function live() {
    var root = document.getElementById('dc-root');
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
  // the emitted HTML keeps the CDN URLs verbatim.
  await page.setRequestInterception(true);
  page.on('request', async (req) => {
    const url = req.url();
    if (url.startsWith(CDN_PREFIX)) {
      const rel = url.slice(CDN_PREFIX.length).split('?')[0];
      if (LOCAL_ASSETS.includes(rel)) {
        try {
          const body = await readFile(join(ROOT, rel));
          return req.respond({
            status: 200,
            contentType: 'text/javascript; charset=utf-8',
            body,
          });
        } catch (err) {
          failedRequests.push(`local asset missing: ${rel} (${err.message})`);
          return req.abort();
        }
      }
    }
    req.continue();
  });

  await page.goto(`http://localhost:${PORT}/${route.source}`, { waitUntil: 'networkidle2', timeout: 60000 });

  // The runtime replaces <x-dc> with #dc-root and renders into it.
  try {
    await page.waitForFunction(
      () => {
        const root = document.getElementById('dc-root');
        return !!(root && root.firstElementChild && root.textContent.trim().length > 500);
      },
      { timeout: 60000 }
    );
  } catch (err) {
    await dumpFailure(page, route, { consoleErrors, pageErrors, failedRequests });
    throw err;
  }
  await page.evaluate(() => document.fonts && document.fonts.ready);

  const { head, body } = await page.evaluate(() => {
    const root = document.getElementById('dc-root');
    // Drop the runtime's own script tags from the captured head; they are
    // re-added deterministically below.
    const headClone = document.head.cloneNode(true);
    headClone.querySelectorAll('script').forEach((s) => s.remove());
    headClone.querySelectorAll('title').forEach((s) => s.remove());
    return { head: headClone.innerHTML, body: root.innerHTML };
  });
  await page.close();

  const supportSrc = (src.match(/<script src="([^"]*support\.js)"><\/script>/) || [])[1];
  if (!supportSrc) throw new Error('could not find the support.js script tag in ' + route.source);

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
${route.head}
<link rel="canonical" href="${route.canonical}" />
${head.trim()}
<script src="${supportSrc}"></script>
</head>
<body>
<div id="__prerender">${body}</div>
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
  if (visibleText.length < 1000) throw new Error(`${route.out}: suspiciously little prerendered text`);
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
    state = await page.evaluate(() => {
      const root = document.getElementById('dc-root');
      return {
        supportJsLoaded: typeof window.__dcBoot === 'function',
        reactLoaded: !!window.React,
        reactDomLoaded: !!window.ReactDOM,
        bootRan: !!root,
        xDcStillPresent: !!document.querySelector('x-dc'),
        renderedTextLength: root ? root.textContent.trim().length : 0,
        rootChildren: root ? root.children.length : 0,
        readyState: document.readyState,
      };
    });
  } catch (e) {
    console.error('  could not read page state:', e.message);
  }

  console.error('  boot chain:');
  const stages = [
    ['support.js executed  (window.__dcBoot)', state.supportJsLoaded],
    ['React loaded         (window.React)', state.reactLoaded],
    ['ReactDOM loaded      (window.ReactDOM)', state.reactDomLoaded],
    ['__dcBoot ran         (#dc-root exists)', state.bootRan],
    ['content rendered     (>500 chars)', state.renderedTextLength > 500],
  ];
  for (const [label, ok] of stages) console.error(`    ${ok ? 'ok  ' : 'FAIL'}  ${label}`);
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
