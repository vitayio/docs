import { login } from './support/api';
import { env } from './support/env';

// Logs both docs users in once and hands the tokens to the workers, so a bad
// password fails the run up front instead of on every entry.
export default async function globalSetup(): Promise<void> {
  for (const role of ['root', 'recruiter'] as const) {
    const { email, password } = env.credentials(role);
    process.env[`DOCS_TOKEN_${role.toUpperCase()}`] = await login(email, password);
  }
}
