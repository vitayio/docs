import { BrowserContext, Page, expect, test } from '@playwright/test';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { DocsApi } from './support/api';
import { App, Role, env, hostFor } from './support/env';

type Step =
  | { click: string }
  | { fill: [string, string] }
  | { waitFor: string }
  | { hover: string };

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
  app-update-banner, #cookieyes, .cky-consent-container, .cky-btn-revisit-wrapper,
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
      await page.addStyleTag({ content: HIDE_CSS }).catch(() => undefined);
      await page.goto(await resolvePath(entry), { waitUntil: 'networkidle' });
      await page.addStyleTag({ content: HIDE_CSS });
      await settle(page);

      for (const step of entry.steps ?? []) {
        if ('click' in step) await page.locator(step.click).first().click();
        else if ('fill' in step) await page.locator(step.fill[0]).first().fill(step.fill[1]);
        else if ('hover' in step) await page.locator(step.hover).first().hover();
        else if ('waitFor' in step) await page.locator(step.waitFor).first().waitFor({ state: 'visible' });
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
  if (path.includes(':preScreeningId')) path = path.replace(':preScreeningId', env.preScreeningId);
  if (/:[a-zA-Z]+/.test(path)) throw new Error(`Unresolved parameter in path ${path}`);
  return path;
}

async function settle(page: Page): Promise<void> {
  await page.waitForLoadState('networkidle');
  await expect(page.locator(BUSY)).toHaveCount(0);
  // Fade-in animations and late layout shifts.
  await page.waitForTimeout(400);
}
