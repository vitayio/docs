import { BrowserContext, Page, expect, test } from '@playwright/test';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { DocsApi } from './support/api';
import { App, Role, env, hostFor } from './support/env';

type Step =
  | { click: string }
  | { fill: [string, string] }
  | { waitFor: string }
  | { hover: string }
  | { scroll: string }
  | { press: string }
  | { wait: number };

interface Entry {
  id: string;
  article: string;
  alt: string;
  app: App;
  as: Role;
  path: string;
  needs?: string;
  steps?: Step[];
  capture: { selector: string } | { viewport: true };
  confidence?: string;
}

const MANIFEST_DIR = join(__dirname, 'manifest');
const OUT_DIR = join(__dirname, '..', 'images', 'screens');

const entries: Entry[] = readdirSync(MANIFEST_DIR)
  .filter((f) => f.endsWith('.json'))
  .sort()
  .flatMap((f) => JSON.parse(readFileSync(join(MANIFEST_DIR, f), 'utf8')) as Entry[]);

// Things that differ between environments or runs and have no place in a
// help article: the staging "Env" badge, the new-version banner, the cookie
// banner, chat widgets, the text caret.
const HIDE_CSS = `
  #sidebar .alert.alert-warning, .navbar .alert.alert-warning:has(.lnr-warning),
  app-update-banner, app-cookie-consent, #cookieyes, .cky-consent-container, .cky-btn-revisit-wrapper,
  #beacon-container, .BeaconFabButtonFrame { display: none !important; }
  * { caret-color: transparent !important; }
`;

// Loading indicators the app shows while data is in flight.
const BUSY = '.spinner:visible, .loading:visible, ngx-skeleton-loader:visible';

let api: DocsApi;

test.beforeAll(async () => {
  api = await DocsApi.create(process.env.DOCS_TOKEN_ROOT as string);
});

test.afterAll(async () => {
  await api?.cleanup();
});

for (const entry of entries) {
  test(entry.id, async ({ browser }) => {
    test.info().annotations.push({ type: 'article', description: entry.article });
    const base = hostFor(entry.app);
    const context = await newContext(browser, base, entry.as);
    try {
      const page = await context.newPage();
      await open(page, entry.as, await resolvePath(entry));
      await page.addStyleTag({ content: HIDE_CSS });
      await settle(page);

      for (const step of entry.steps ?? []) {
        if ('click' in step) await page.locator(step.click).first().click();
        else if ('fill' in step) await page.locator(step.fill[0]).first().fill(step.fill[1]);
        else if ('hover' in step) await page.locator(step.hover).first().hover();
        else if ('waitFor' in step) await page.locator(step.waitFor).first().waitFor({ state: 'visible' });
        else if ('scroll' in step) await page.locator(step.scroll).first().scrollIntoViewIfNeeded();
        else if ('press' in step) await page.keyboard.press(step.press);
        else if ('wait' in step) await page.waitForTimeout(step.wait);
        await settle(page);
      }

      const path = join(OUT_DIR, `${entry.id}.png`);
      if ('selector' in entry.capture) {
        const target = page.locator(entry.capture.selector).first();
        await expect(target).toBeVisible();
        await target.screenshot({ path, animations: 'disabled' });
      } else {
        await page.screenshot({ path, animations: 'disabled' });
      }
    } finally {
      await context.close();
    }
  });
}

async function newContext(browser: import('@playwright/test').Browser, baseURL: string, role: Role): Promise<BrowserContext> {
  const context = await browser.newContext({ baseURL });
  // Reject the cookie banner whenever it appears so it never covers a button.
  context.on('page', (page) => {
    const reject = page.locator('[data-test="cc-reject-all"]');
    void page.addLocatorHandler(reject, () => reject.click(), { noWaitAfter: true });
  });
  if (role !== 'none') {
    // The references and configuration apps share the lax recruiter-token
    // cookie on the parent domain (EnvironmentsService.setToken).
    const host = new URL(baseURL).hostname;
    await context.addCookies([
      {
        name: 'recruiter-token',
        value: process.env[`DOCS_TOKEN_${role.toUpperCase()}`] as string,
        domain: '.' + host.split('.').slice(-2).join('.'),
        path: '/',
        sameSite: 'Lax'
      }
    ]);
  }
  return context;
}

async function resolvePath(entry: Entry): Promise<string> {
  let path = entry.path;
  if (path.includes(':referenceRequestId')) {
    path = path.replace(':referenceRequestId', await api.referenceRequestId());
  }
  if (path.includes(':referenceId')) {
    // Public form → a fresh, unanswered link. Recruiter pages → the showcase reference.
    const id = entry.app === 'public-referee' ? await api.publicReferenceId() : env.referenceId;
    path = path.replace(':referenceId', id);
  }
  if (path.includes(':candidateId')) path = path.replace(':candidateId', env.candidateId);
  if (path.includes(':recruiterId')) path = path.replace(':recruiterId', recruiterIdOf('RECRUITER'));
  if (path.includes(':preScreeningId')) path = path.replace(':preScreeningId', env.preScreeningId);
  if (/:[a-zA-Z]+/.test(path)) throw new Error(`Unresolved parameter in path ${path}`);
  return path;
}

// The recruiter docs user's own id, read from its login token.
function recruiterIdOf(role: 'ROOT' | 'RECRUITER'): string {
  const token = process.env[`DOCS_TOKEN_${role}`] as string;
  return JSON.parse(Buffer.from(token.split('.')[1] ?? '', 'base64url').toString('utf8')).recruiter_id;
}

// Signed-in pages are opened from inside the app: route guards such as
// PreScreeningsGuard read firm settings that are not loaded yet on a cold
// deep link, and bounce to the dashboard.
async function open(page: Page, role: Role, path: string): Promise<void> {
  if (role === 'none') {
    await page.goto(path, { waitUntil: 'networkidle' });
    return;
  }
  await page.goto('/', { waitUntil: 'networkidle' });
  await settle(page);
  await page.evaluate((url) => {
    history.pushState({}, '', url);
    dispatchEvent(new PopStateEvent('popstate', { state: {} }));
  }, path);
  await page.waitForLoadState('networkidle');
  // A redirect to a child route (/dashboard → /dashboard/references) is fine.
  const wanted = path.split('?')[0];
  const landed = new URL(page.url());
  if (landed.pathname !== wanted && !landed.pathname.startsWith(wanted + '/')) {
    throw new Error(`Opened ${path} but the app redirected to ${landed.pathname}`);
  }
}

async function settle(page: Page): Promise<void> {
  await page.waitForLoadState('networkidle');
  await expect(page.locator(BUSY)).toHaveCount(0);
  // Fade-in animations and late layout shifts.
  await page.waitForTimeout(400);
}
