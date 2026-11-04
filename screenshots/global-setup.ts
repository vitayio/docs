import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { login } from './support/api';
import { env } from './support/env';

// Tokens are cached between runs (gitignored, owner-only): staging allows
// 10 logins per email per 5 minutes, which re-runs used to hit.
const CACHE = join(__dirname, '.tokens.json');
const MIN_LIFETIME_S = 30 * 60;

type Cache = Record<string, { email: string; token: string }>;

function exp(token: string): number {
  return JSON.parse(Buffer.from(token.split('.')[1] ?? '', 'base64url').toString('utf8')).exp ?? 0;
}

// Logs both docs users in once and hands the tokens to the workers, so a bad
// password fails the run up front instead of on every entry.
export default async function globalSetup(): Promise<void> {
  const key = env.hosts.api;
  const all: Record<string, Cache> = existsSync(CACHE) ? JSON.parse(readFileSync(CACHE, 'utf8')) : {};
  const cache = (all[key] ??= {});
  for (const role of ['root', 'recruiter'] as const) {
    const { email, password } = env.credentials(role);
    const cached = cache[role];
    const fresh = cached && cached.email === email && exp(cached.token) - Date.now() / 1000 > MIN_LIFETIME_S;
    const token = fresh ? cached.token : await login(email, password);
    cache[role] = { email, token };
    process.env[`DOCS_TOKEN_${role.toUpperCase()}`] = token;
  }
  writeFileSync(CACHE, JSON.stringify(all, null, 2), { mode: 0o600 });
}
